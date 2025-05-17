import type { PluginObj, PluginPass } from "@babel/core";
import type { BabelAPI } from "@babel/helper-plugin-utils";
import { compileSoyToJsSync } from "closure-templates-compiler";
import { extname } from "path";

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
      visitor: {
        Program: {
          enter(path, state) {
            const filename = state?.file?.opts?.filename;
            const code = state?.file?.code;

            if (filename == null || extname(filename) !== ".soy") {
              return;
            }
          },
        },
      },
    };
  },
);

/*
In:
<soy language>

Out:
<javascript>
 */
