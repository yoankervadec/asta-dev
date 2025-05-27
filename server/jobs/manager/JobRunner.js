//
// server/jobs/manager/JobRunner.js

class JobRunner {
  constructor() {
    this.queue = [];
    this.running = false;
  }
  async enqueue(job, params = undefined) {
    this.queue.push({ job, params });
    this.processQueue();
  }

  async processQueue() {
    if (this.running || this.queue.length === 0) return;

    this.running = true;
    const { job, params } = this.queue.shift();

    try {
      await job.run(params);
    } catch (err) {
      console.error(`Failed to run job ${job.jobName}:`, err.message);
    }

    this.running = false;
    // Immediately process the next job
    setImmediate(() => this.processQueue());
  }
}

const jobRunner = new JobRunner();
export default jobRunner;
