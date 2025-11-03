import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: "./dist",
    sourcemap: "hidden",
  },
  envDir: "./",
  plugins: [react()],
  root: "./",
  server: {
    port: 3000,
  },
});
