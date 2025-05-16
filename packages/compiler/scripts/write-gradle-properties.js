// @ts-check
const fs = require("fs");

/** @type {{engines: {java: string}, javaDependencies: string[]}} */
const pkg = require("../package.json");

const javaVersion = pkg.engines?.java?.match(/\d+/)?.[0] || "17";
const deps = pkg.javaDependencies || [];

const out = [
  `javaVersion=${javaVersion}`,
  `javaDependencies=${deps.join(",")}`,
].join("\n");

fs.writeFileSync("gradle.properties", out);
