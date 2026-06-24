import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",

  // Cache-busting for mobile: ensures new hashed filenames on each build
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
