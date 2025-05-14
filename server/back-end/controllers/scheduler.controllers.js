//
// server/back-end/controllers/scheduler.controllers.js

import scheduler from "../../jobs/schedulers/schedulers.js";

export const schedulerController = {
  startAllJobs: async (req, res) => {
    try {
      await scheduler.startAll();
      res.json({ message: "Triggered restart successfully." });
    } catch (error) {
      console.error("Failed to start jobs:", error);
      res.status(500).json({ error: "Failed to start jobs" });
    }
  },

  stopAllJobs: (req, res) => {
    try {
      scheduler.stopAll();
      res.json({ message: "All jobs stopped." });
    } catch (error) {
      console.error("Failed to stop jobs:", error);
      res.status(500).json({ error: "Failed to stop jobs" });
    }
  },

  triggerJob: (req, res) => {
    const { jobName } = req.params;
    try {
      scheduler.triggerJob(jobName);
      res.json({ message: `Job "${jobName}" triggered.` });
    } catch (error) {
      console.error(`Failed to trigger job "${jobName}":`, error);
      res.status(500).json({ error: `Failed to trigger job "${jobName}"` });
    }
  },
};
