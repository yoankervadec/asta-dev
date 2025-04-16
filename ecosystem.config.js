//
// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "asta-client-prod",
      script: "npm",
      args: "run start",
      cwd: "./client",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3700,
      },
    },
    {
      name: "asta-server-prod",
      script: "npm",
      args: "run start",
      cwd: "./server",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 8081,
        PATH: "/usr/bin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        LD_LIBRARY_PATH:
          "/usr/lib/x86_64-linux-gnu:/snap/core/current/lib:/snap/core/current/usr/lib",
        DBUS_SESSION_BUS_ADDRESS: "unix:path=/run/user/1000/bus",
        PUPPETEER_EXECUTABLE_PATH:
          "/snap/chromium/current/usr/lib/chromium-browser/chrome",
      },
    },
  ],
};
