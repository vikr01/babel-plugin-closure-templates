import * as plugin from "babel-plugin-closure-templates";
import { wasGeneratedBySoyCompiler } from "private-test-helpers";
import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";

import { transformWithPreset } from "./helpers";
import type { PresetOptions } from "..";

describe("babel-preset-closure-templates", () => {
  beforeEach(() => {
    // pluginSpy.mockClear();
    vi.clearAllMocks();
  });

  afterAll(() => {
    // pluginSpy.mockReset();
    vi.resetAllMocks();
  });

  it("uses the plugin correctly", () => {
    const pluginSpy = vi.spyOn(plugin, "default");

    const code = transformWithPreset("file.soy");

    expect(wasGeneratedBySoyCompiler(code)).toBe(true);

    expect(pluginSpy.mock.lastCall?.[1]).toStrictEqual({});
  });

  it("passes options to the plugin correctly", () => {
    const pluginSpy = vi.spyOn(plugin, "default");

    const opts: PresetOptions = {
      soyExtensions: [".bar"],
      omitExtensions: [".baz", ".foo"],
      dangerouslyAlwaysTryBuilding: true,
    };

    const code = transformWithPreset("file.bar", opts);

    expect(wasGeneratedBySoyCompiler(code)).toBe(true);

    expect(pluginSpy.mock.lastCall?.[1]).toStrictEqual(opts);
  });
});
