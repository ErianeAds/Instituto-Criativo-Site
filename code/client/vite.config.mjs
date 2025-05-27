import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "./static",
  base: "./",
  preview: {
    port: process.env.PORT || 8080,
    host: true,
    allowedHosts: "all",
  },
});