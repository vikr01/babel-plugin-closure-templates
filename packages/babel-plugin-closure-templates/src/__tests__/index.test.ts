import {
  basicSoyString,
  wasGeneratedBySoyCompiler,
} from "private-test-helpers";
import { describe, it, expect } from "vitest";
import { getFixtures, transformWithPlugin as transform } from "./helpers";

describe("plugin", () => {
  it.concurrent.for(getFixtures())(
    'fixture: "%s" compiles',
    async ([, { fileContents, generatedFileName, niceFileName }]) => {
      const transformed = transform(fileContents, niceFileName);

      await expect(transformed).toMatchFileSnapshot(generatedFileName);
    },
  );

  it("can be forced to run on all files using dangerouslyAlwaysTryBuilding: true", async () => {
    const soy = transform(basicSoyString, null, {
      dangerouslyAlwaysTryBuilding: true,
    });

    expect(soy).toMatchSnapshot();

    const soy2 = transform(basicSoyString, "not-a-soy-file.notsoy", {
      dangerouslyAlwaysTryBuilding: true,
    });

    expect(soy2).toMatchSnapshot();
  });

  it("throws if you pass a soy string without a .soy file and without dangerouslyAlwaysTryBuilding: true", () => {
    expect(() => {
      transform(basicSoyString, null);
    }).toThrow();

    expect(() => {
      transform(basicSoyString, null, { dangerouslyAlwaysTryBuilding: false });
    }).toThrow();
  });

  it("throws if you pass a soy string without a .soy file and without dangerouslyAlwaysTryBuilding: true", () => {
    expect(() => {
      transform(basicSoyString, null);
    }).toThrow();

    expect(() => {
      transform(basicSoyString, null, { dangerouslyAlwaysTryBuilding: false });
    }).toThrow();
  });

  it("can still compile js if you have dangerouslyAlwaysTryBuilding: true", () => {
    const expectedResult = "this is the expected result";
    const code = transform(
      /* js */ `
        function foo() { 
          return ${JSON.stringify(expectedResult)}; 
        }
        
        foo();
        `,
      null,
    );

    expect(eval(code)).toBe(expectedResult);
  });

  it("can run on different extensions if you change the extensions array", async () => {
    const soyExtensions = [".foobarbaz", ".soyplus"];

    expect(() => {
      transform(basicSoyString, "validsoyfilename.soy", { soyExtensions });
    }).toThrow();

    expect(
      wasGeneratedBySoyCompiler(
        transform(basicSoyString, "otherfileType.foobarbaz", {
          soyExtensions,
        }),
      ),
    ).toBe(true);

    expect(
      wasGeneratedBySoyCompiler(
        transform(basicSoyString, "extendedType.soyplus", {
          soyExtensions,
        }),
      ),
    ).toBe(true);
  });

  it("can skip on different extensions if you change the omit array", async () => {
    const omitExtensions = [".ignoreme.soy"];

    expect(() => {
      transform(basicSoyString, "validsoyfilename.ignoreme.soy", {
        omitExtensions,
      });
    }).toThrow();

    expect(
      wasGeneratedBySoyCompiler(
        transform(basicSoyString, "validsoyfilename.notignored.soy", {
          omitExtensions,
        }),
      ),
    ).toBe(true);
  });
});
