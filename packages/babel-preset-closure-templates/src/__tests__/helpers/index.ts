import { basicSoyString, transform } from "private-test-helpers";
import preset, { type PresetOptions } from "../..";

export const transformWithPreset = (
  filename: null | string,
  presetOptions: PresetOptions = {},
) =>
  transform(basicSoyString, filename, {
    presets: [[preset, presetOptions]],
  });
