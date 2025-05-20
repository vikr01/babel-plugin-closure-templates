import type { PluginItem } from "@babel/core";
import type { PluginOptions } from "babel-plugin-closure-templates";

import { declarePreset } from "@babel/helper-plugin-utils";
import babelPluginClosureTemplates from "babel-plugin-closure-templates";

type PresetObj = { plugins: PluginItem[] };

declare module "@babel/helper-plugin-utils" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function declarePreset<O extends Record<string, any> = object>(
    cb: (
      api: BabelAPI,
      options: O | null | undefined,
      dirname: string,
    ) => PresetObj,
  ): PresetObj;
}

export type PresetOptions = PluginOptions;

export default declarePreset<PresetOptions>((api, opts) => {
  api.assertVersion(7);
  opts = opts ?? {};

  const { ...babelPluginSoyOptions } = opts;

  return {
    plugins: [[babelPluginClosureTemplates, babelPluginSoyOptions]],
  };
});
