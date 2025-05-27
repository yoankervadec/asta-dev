//
// server/jobs/manager/Scheduler.js

import jobRunner from "./JobRunner.js";
import Job from "./Job.js";

class Scheduler {
  constructor(jobConfigs) {
    this.jobs = jobConfigs.map(
      ({ jobName, executeTask }) => new Job(jobName, executeTask)
    );
    this.intervals = new Map();
    this.started = false;
  }

  async startAll() {
    if (this.started) {
      console.warn("Scheduler already started. Skipping re-start.");
      return;
    }

    this.started = true;

    for (const job of this.jobs) {
      await job.fetchJobConfig();
      if (!job.cachedConfig?.active) continue;
      this.schedule(job);
    }
  }

  schedule(job) {
    const config = job.cachedConfig;

    if (config.run_times) {
      const interval = setInterval(async () => {
        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 5); // "HH:MM"
        if (config.run_times.includes(timeStr)) {
          jobRunner.enqueue(job);
        }
      }, 60 * 1000);
      this.intervals.set(job.jobName, interval);
    } else if (config.interval_ms) {
      const runLoop = async () => {
        jobRunner.enqueue(job);
        const timeout = setTimeout(runLoop, config.interval_ms);
        this.intervals.set(job.jobName, timeout);
      };
      runLoop();
    }
  }

  stopAll() {
    for (const timer of this.intervals.values()) {
      clearInterval(timer);
      clearTimeout(timer);
    }
    this.intervals.clear();
    this.started = false;
  }

  triggerJob(jobName, params = undefined) {
    const job = this.jobs.find((j) => j.jobName === jobName);
    if (!job) {
      console.warn(`Job "${jobName}" not found.`);
      return;
    }
    jobRunner.enqueue(job, params);
  }
}

export default Scheduler;
