// For unbuild
import * as path from "path";
import { defineBuildConfig } from "unbuild";
import { packagesWithPackageJson as packages } from "./scripts/packages";

export default defineBuildConfig({
  entries: packages.map((packagePath) => ({
    builder: "mkdist",
    input: path.join(packagePath, "./src/"),
    outDir: path.join(packagePath, "./dist/"),
    ext: "js",
    format: "cjs",
    pattern: ["**/*", "!**/*.test.{ts,tsx}", "!**/*/__tests__/**"],
  })),

  declaration: true,

  clean: true,

  sourcemap: false,
});
