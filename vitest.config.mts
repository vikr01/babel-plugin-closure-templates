import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["verbose"],

    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    watch: false,
    
    globals: true,
  },
});
