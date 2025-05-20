// For unbuild
import * as path from "path";
import { defineBuildConfig, type BuildEntry } from "unbuild";
import { packagesWithPackageJson as packages } from "./scripts/packages";

export default defineBuildConfig({
  entries: packages.map(
    (packagePath): BuildEntry => ({
      input: path.join(packagePath, "./src/"),
      outDir: path.join(packagePath, "./dist/"),

      builder: "mkdist",
      ext: "js",
      format: "cjs",
      pattern: ["**/*", "!**/*.test.{ts,tsx}", "!**/__tests__/**"],

      cleanDist: true,
      declaration: true,
    }),
  ),

  sourcemap: false,
});
