import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [], // Możesz dodać pliki setup, np. do custom matchers
    exclude: [
      "e2e/**", // <-- wyklucza testy Playwrighta
      "node_modules",
      "dist",
    ],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/lib/utils"),
      "@/ui": path.resolve(__dirname, "./src/components/ui"),
    },
  },
});
