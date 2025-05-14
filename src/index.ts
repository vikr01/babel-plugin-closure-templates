import type { PluginObj, PluginPass } from "@babel/core";
import type { BabelAPI } from "@babel/helper-plugin-utils";

import { declare } from "@babel/helper-plugin-utils";

type PluginOptions = Record<never, never>;

type PluginState = PluginPass;

export default declare<PluginOptions, PluginObj<PluginState>>(
  (
    api: BabelAPI,
    _options?: PluginOptions,
    _dirname?: string,
  ): PluginObj<PluginState> => {
    api.assertVersion(7);

    return {
      visitor: {},
    };
  },
);

/*
In:
<soy language>

Out:
<javascript>
 */
