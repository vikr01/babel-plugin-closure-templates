import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    reporters: ["verbose"],

    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    watch: false,
    
    globals: true,
  },

  plugins: [tsconfigPaths()],
});
