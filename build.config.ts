// For unbuild
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    {
      builder: "mkdist",
      input: "./src/",
      outDir: "./dist/",
      ext: "js",
      format: "cjs",
      pattern: ["**/*", "!**/*.test.{ts,tsx}", "!**/*/__tests__/**"],
    },
  ],

  declaration: true,

  clean: true,

  sourcemap: false,
});
