//
// server/jobs/manager/Job.js

import { format } from "date-fns";

import { query } from "../../back-end/configs/db.config.js";

class Job {
  constructor(jobName, executeTask) {
    this.jobName = jobName;
    this.executeTask = executeTask; // actual job
    this.cachedConfig = null;
  }

  // Update job status (active / innactive)
  async updateJobStatus(status) {
    await query(
      `
      UPDATE
        schedulers
      SET
        active = ?
      WHERE
        job_name = ?
      `,
      [status ? 1 : 0, this.jobName]
    );
  }

  // Get job config
  async fetchJobConfig() {
    try {
      const [config] = await query(
        `
        SELECT
          job_id,
          job_name,
          active,
          interval_ms,
          run_times,
          last_run,
          next_run,
          -- last_log,
          -- last_error,
          priority
        FROM
          schedulers
        WHERE
          job_name = ?
        `,
        [this.jobName]
      );
      this.cachedConfig = config;
      // console.log(
      //   `${this.jobName} refreshed config: ${JSON.stringify(config)}`
      // );
    } catch (error) {
      console.error("Failed to update Job Config: " + error.message);
    }
  }

  // Jog job run
  async logJobRun(runMessage = null, errorMessage = null) {
    try {
      await query(
        `
        UPDATE
          schedulers
        SET
          last_run = NOW(),
          last_log = ?,
          last_error = ?
        WHERE
          job_name = ?
        `,
        [
          runMessage ? runMessage : null,
          errorMessage ? errorMessage : null,
          this.jobName,
        ]
      );
    } catch (error) {
      console.error("Failed to log Job Run: " + error.message);
    }
  }

  // Run job once
  async run() {
    try {
      const result = await this.executeTask();
      const now = new Date();
      const formatted = format(now, "yyyy-MM-dd HH:mm:ss:SSS");
      console.log(`[${formatted}] ${this.jobName}:\t${JSON.stringify(result)}`);
      await this.logJobRun(`${this.jobName} ran successfully at ${new Date()}`);
    } catch (err) {
      console.error(`Error running job ${this.jobName}:`, err.message);
      await this.updateJobStatus(false);
      await this.logJobRun(null, err.message);
    }
  }

  // Stop job and update status
  stop() {}
}

export default Job;
