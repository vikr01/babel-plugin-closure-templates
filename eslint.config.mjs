import { createConfig } from "@vikr01/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig(
  createConfig({
    json: false,
    typescript: true,
  }),
  globalIgnores(["./dist/"]),
);
