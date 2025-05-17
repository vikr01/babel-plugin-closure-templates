import java from "java";
const jarPath = require.resolve("../../compiler/SoyCompiler.jar");

java.classpath.push(jarPath);

/**
 * Compiles Soy template code to JS using Java (synchronously).
 */
export function compileSoyToJsSync(
  soyCode: string,
  filename: string = "[no file specified]",
): string {
  return java.callStaticMethodSync(
    "MyCompiler",
    "compileSoyToJs",
    soyCode,
    filename,
  );
}
