import * as babel from "@babel/core";
import * as fs from "fs";
import * as path from "path";
import { describe, it, expect } from "vitest";
import plugin from "..";
const fixtures = getFixtures();

describe("plugin", () => {
  it.concurrent.for(fixtures)(
    '"%s" fixture compiles',
    async ([, fixtureDirectoryPath]) => {
      const fileContents = fs
        .readFileSync(path.join(fixtureDirectoryPath, "./index.soy"))
        .toString();

      const transformed = await transform(fileContents);

      expect(transformed).toMatchFileSnapshot(
        path.join(fixtureDirectoryPath, "./index.js"),
      );
    },
  );
});

type FixtureName = string;
type FixtureDirectoryPath = string;

function getFixtures(): [FixtureName, FixtureDirectoryPath][] {
  const fixturesFolder = path.join(__dirname, "fixtures");

  return fs
    .readdirSync(fixturesFolder, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [entry.name, path.join(fixturesFolder, entry.name)]);
}

async function transform(code: string): Promise<string> {
  const res = await babel.transformAsync(code, {
    plugins: [plugin],
    configFile: false,
    babelrc: false,
  });

  console.log('res', res);

  return res?.code as string;
}
