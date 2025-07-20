import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/IMDB-frontend/",
  server: {
    proxy: {
      "/api": {
        target: "https://imdb-backend-rore.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
