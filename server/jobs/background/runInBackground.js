//
// server/jobs/background/runInBackground.js

export const runInBackground = async (fn) => {
  await Promise.resolve().then(() => fn());
};
