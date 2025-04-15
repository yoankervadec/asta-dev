//
// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "asta-client-dev",
      script: "npm",
      args: "run dev",
      cwd: "./client",
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3300,
      },
    },
    {
      name: 'asta-server-dev',
      script: 'npm',
      args: 'run dev',
      cwd: './server',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 8080,
        PATH: '/usr/bin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        LD_LIBRARY_PATH: '/usr/lib/x86_64-linux-gnu:/snap/core/current/lib:/snap/core/current/usr/lib',
        DBUS_SESSION_BUS_ADDRESS: 'unix:path=/run/user/1000/bus',
        PUPPETEER_EXECUTABLE_PATH: '/snap/chromium/current/usr/lib/chromium-browser/chrome',
      },
    },
  ],
};
