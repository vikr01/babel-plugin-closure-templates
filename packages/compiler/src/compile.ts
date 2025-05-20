import { appendClasspath, importClass } from "java-bridge";
const jarPath = require.resolve("../compiler/dist/SoyCompiler.jar");

appendClasspath(jarPath);
const MyCompiler = importClass("SoyCompiler");

type SoyCodeString = string;
type NullableFilename = string | null | undefined;

const DEFAULT_FILENAME = "[no file specified]";

/**
 * Compiles Soy template code to JS using Java synchronously.
 */
export function compileSoyToJsSync(
  soyCode: SoyCodeString,
  filename?: NullableFilename,
): string {
  filename = filename ?? DEFAULT_FILENAME;
  return MyCompiler.compileSoyToJsSync(soyCode, filename);
}

/**
 * Compiles Soy template code to JS using Java asynchronously.
 */
export async function compileSoyToJs(
  soyCode: SoyCodeString,
  filename?: NullableFilename,
): Promise<string> {
  filename = filename ?? DEFAULT_FILENAME;
  return MyCompiler.compileSoyToJs(soyCode, filename);
}
