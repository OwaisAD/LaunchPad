import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    cors: {
      origin: ["https://launchpad.sportia.dk", "http://localhost:8080"],
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    },
    allowedHosts: ["launchpad.sportia.dk"],
  },
});
