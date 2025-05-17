import { appendClasspath, importClass } from "java-bridge";
// import java from "java";
const jarPath = require.resolve("../../compiler/SoyCompiler.jar");

appendClasspath(jarPath);
const MyCompiler = importClass("MyCompiler");

/**
 * Compiles Soy template code to JS using Java (synchronously).
 */
export function compileSoyToJsSync(
  soyCode: string,
  filename?: string | null | undefined,
): string {
  filename = filename ?? "[no file specified]";
  return MyCompiler.compileSoyToJsSync(soyCode, filename);
}
