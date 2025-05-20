import { describe, it, expect } from "vitest";
import { compileSoyToJs, compileSoyToJsSync } from "../compile";

describe("compiler", () => {
  it("works", () => {
    const soyCode = [
      "{namespace soy.examples.simple}",
      "/**",
      " * Says hello to the world.",
      " */",
      "{template helloWorld}",
      '  {msg desc="Says hello to the world."}',
      "    Hello world!",
      "  {/msg}",
      "{/template}",
    ].join("\n");

    expect(compileSoyToJsSync(soyCode)).toMatchSnapshot();
  });

  it("works async", async () => {
    const soyCode = [
      "{namespace soy.examples.simple}",
      "/**",
      " * Says hello to the world.",
      " */",
      "{template helloWorld}",
      '  {msg desc="Says hello to the world."}',
      "    Hello world!",
      "  {/msg}",
      "{/template}",
    ].join("\n");

    expect(await compileSoyToJs(soyCode)).toMatchSnapshot();
  });
});
