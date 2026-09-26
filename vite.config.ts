import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    restoreMocks: true,
    coverage: { include: ["src/**", "eslintRules/**"], thresholds: { 100: true } },
    projects: [
      {
        extends: true,
        test: {
          name: "app",
          environment: "jsdom",
          include: ["tests/**/*.test.{ts,tsx}"],
          exclude: ["tests/eslintRules/**"],
          setupFiles: ["tests/setup.ts"],
        },
      },
      {
        extends: true,
        test: { name: "eslintRules", environment: "node", include: ["tests/eslintRules/**/*.test.ts"] },
      },
    ],
  },
});
