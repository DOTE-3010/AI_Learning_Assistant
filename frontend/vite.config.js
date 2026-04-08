import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/ui/",
  build: {
    outDir: resolve(__dirname, "../backend/static"),
    emptyOutDir: true,
  },
});
