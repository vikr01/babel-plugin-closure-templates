import type {
  ParserOptions,
  ParseResult,
  PluginObj,
  PluginPass,
} from "@babel/core";
import type { BabelAPI } from "@babel/helper-plugin-utils";

import { declare } from "@babel/helper-plugin-utils";
import { compileSoyToJsSync } from "closure-templates-compiler";
import { basename, extname } from "path";

type FileExtensions = readonly ReturnType<typeof extname>[];

export type PluginOptions = {
  dangerouslyAlwaysTryBuilding?: boolean;
  omitExtensions?: FileExtensions;
  soyExtensions?: FileExtensions;
};

type PluginState = PluginPass;

export default declare<PluginOptions, PluginObj<PluginState>>(
  (
    api: BabelAPI,
    options?: PluginOptions,
    _dirname?: string,
  ): PluginObj<PluginState> => {
    api.assertVersion(7);

    const parserOverride: BabelParseOverride = (...args) =>
      parserOverrideWithPluginOptions(options, ...args);

    return {
      // @ts-expect-error https://babeljs.io/docs/babel-parser#will-the-babel-parser-support-a-plugin-system
      parserOverride,
      visitor: {},
    };
  },
);

type NullablePluginOptions = null | undefined | PluginOptions;

type BabelParseOverride = (
  code: string,
  opts: undefined | ParserOptions,
  parse: BabelParseOverride,
) => ParseResult;

function parserOverrideWithPluginOptions(
  pluginOptions: NullablePluginOptions,
  code: Parameters<BabelParseOverride>[0],
  opts: Parameters<BabelParseOverride>[1],
  parse: Parameters<BabelParseOverride>[2],
): ReturnType<BabelParseOverride> {
  const dangerouslyAlwaysTryBuilding =
    pluginOptions?.dangerouslyAlwaysTryBuilding ?? false;

  const filename =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opts?.sourceFilename ?? (opts as any)?.sourceFileName ?? null;

  const compile = () => compileSoyToJsSync(code, filename);

  if (dangerouslyAlwaysTryBuilding) {
    try {
      code = compile();
    } catch {}
  } else if (isValidSoyFile(code, filename, pluginOptions)) {
    code = compile();
  }

  // Use Babel's current parser to parse the transformed code
  return parse(code, opts, parse);
}

const DEFAULT_SOY_EXTENSIONS = [".soy"];

function isValidSoyFile(
  _code: string,
  filename: unknown,
  pluginOptions: NullablePluginOptions,
): boolean {
  if (filename == null || typeof filename !== "string") {
    return false;
  }

  const omitExtensions = pluginOptions?.omitExtensions;

  if (
    omitExtensions != null &&
    omitExtensions.some((ext) => basename(filename).endsWith(ext))
  ) {
    return false;
  }

  const soyExtensions = pluginOptions?.soyExtensions ?? DEFAULT_SOY_EXTENSIONS;

  return soyExtensions.includes(extname(filename));
}

/*
In:
<soy language>

Out:
<javascript>
 */
