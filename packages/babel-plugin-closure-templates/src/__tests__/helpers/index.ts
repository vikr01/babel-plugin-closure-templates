import { transform } from "private-test-helpers";
import * as fs from "fs";
import * as path from "path";
import plugin, { type PluginOptions } from "../..";

const rootDir = path.dirname(require.resolve("../../../package.json"));

type FixtureName = string;
type Helpers = {
  fileContents: string;
  generatedFileName: string;
  niceFileName: string;
};

type Result = [FixtureName, Helpers];

export function getFixtures(): Result[] {
  const fixturesFolder = path.join(__dirname, "../fixtures");

  return fs
    .readdirSync(fixturesFolder, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const fixtureDirectoryPath = path.join(entry.parentPath, entry.name);

      const fileName = path.join(fixtureDirectoryPath, "./index.soy");
      const niceFileName = path.relative(rootDir, fileName);

      const generatedFileName = path.join(fixtureDirectoryPath, "./index.js");

      const fileContents = fs.readFileSync(fileName).toString();

      return [
        entry.name,
        {
          fileContents,
          generatedFileName,
          niceFileName,
        },
      ] as Result;
    });
}

export function transformWithPlugin(
  code: string,
  filename: null | string,
  pluginOptions: PluginOptions = {},
): string {
  return transform(code, filename, {
    plugins: [[plugin, pluginOptions]],
  });
}
