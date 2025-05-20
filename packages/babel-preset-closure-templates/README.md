# `babel-preset-closure-templates`

Babel preset that uses allows you to build [google closure-templates](https://github.com/google/closure-templates).

It uses the actual google closure-templates compiler under the hood using [`java-bridge`](https://github.com/MarkusJx/node-java-bridge).

You'll need to use [google-closure-library](https://github.com/google/closure-library) alongside to use google syntax (i.e. `goog.require`, `goog.provide`).

> [!NOTE]
> `google-closure-library` is archived and no longer maintained, so you'll either want another transformer to convert to ESM, or a replacement library. See [google/closure-templates#30](https://github.com/google/closure-templates/issues/30) for more details.

## Getting started

```sh
npm install --save-dev babel-preset-closure-templates java-bridge
```

In `babel.config.js`:

```js
const babelPresetClosureTemplates = require('babel-preset-closure-templates');

module.exports = {
  presets: [
    // ... your other plugins
    [babelPresetClosureTemplates, {
      // ... options for the preset
    }],
  ],
}
```

### Preset Options

- `dangerouslyAlwaysTryBuilding` - `boolean` to always try building with the closure templates compiler on every file
  - Default: `false`
- `omitExtensions` - array of file extensions to be omitted from the 
  - Default: `[]`
- `soyExtensions` - array of file extensions that are considered soy templates
  - Default: `[".soy"]`

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
