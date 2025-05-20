# `closure-templates-compiler`

Simple javascript module that uses `java-bridge` under the hood to compile a string written in [google closure templates](https://github.com/google/closure-templates) language to javascript.

It also contains a small java project (which is published as a jar), because the compiler for google closure templates is written in java. The java is just a wrapper to invoke the API of the closure templates compiler directly rather than use the CLI version.

## Getting started

```sh
npm install --save closure-templates-compiler
```

### API
```js
import { compileSoyToJs, compileSoyToJsSync } from "closure-templates-compiler";

const soyCode = `
{namespace soy.examples.simple}

{template helloWorld}
  {msg desc="Says hello to the world."}
    Hello world!
  {/msg}
{/template}
`;

const filename = "foobar.soy";

const jsCodeString = await compileSoyToJs(soyCode, filename);

const jsCodeStringAlternate = compileSoyToJsSync(soyCode, filename);
```

## Example:

In:
```soy
{namespace soy.examples.simple}

{template helloWorld}
  {msg desc="Says hello to the world."}
    Hello world!
  {/msg}
{/template}
```

Out:
```js
goog.provide('soy.examples.simple');
goog.require('goog.soy');
goog.requireType('goog.soy.data.SanitizedHtml');
goog.require('soy');

soy.examples.simple.helloWorld = function (opt_data, opt_ijData) {
  const $ijData =opt_ijData;
  if (goog.soy.shouldStub && goog.soy.shouldStubAtRuntime() && soy.examples.simple.helloWorld_soyInternalStubs) {
    return soy.examples.simple.helloWorld_soyInternalStubs(opt_data, $ijData);
  }
  if (goog.DEBUG && soy.$$stubsMap['soy.examples.simple.helloWorld']) {
    return soy.$$stubsMap['soy.examples.simple.helloWorld'](opt_data, $ijData);
  }
  return soy.VERY_UNSAFE.ordainSanitizedHtml('Hello world!');
};
if (false) {
  soy.examples.simple.helloWorld_soyInternalStubs;
}
if (goog.DEBUG) {
  soy.examples.simple.helloWorld.soyTemplateName = 'soy.examples.simple.helloWorld';
}
```
