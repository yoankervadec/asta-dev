import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const port = parseInt(env.VITE_PORT);

  return {
    plugins: [react()],
    server: {
      allowedHosts: ["asta.local"],
      host: "0.0.0.0",
      port,
      proxy: {
        "/api": {
          target: env.VITE_BACKEND,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
