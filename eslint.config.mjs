import { createConfig } from "@vikr01/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig(
  createConfig({
    json: false,
    typescript: true,
  }),
  globalIgnores([
    "packages/*/dist/",
    "**/__tests__/fixtures/",
    "packages/compiler/build/",
    "packages/compiler/compiler/",
    "packages/compiler/bin/",
  ]),
);
