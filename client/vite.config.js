import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["asta.local"],
    host: "0.0.0.0",
    port: 3700,
    proxy: {
      "/api": {
        target: "http://localhost:8081", // Back-end URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
