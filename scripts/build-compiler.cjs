// @ts-check

const fs = require("fs/promises");
const { spawn } = require("child_process");
const path = require("path");
const semver = require("semver");

/** @type {string} */
const rootDir = path.dirname(require.resolve("../package.json"));
const vendorDir = path.join(rootDir, "vendor", "closure-templates");
const outputDir = path.join(
  path.dirname(require.resolve("../packages/compiler/package.json")),
  "dist/",
);
const jarName = "SoyToJsSrcCompiler_deploy.jar";
const bazelTarget = `//java/src/com/google/template/soy:${jarName}`;

(async () => {
  try {
    const requiredRange = await getRequiredJavaVersionFromPackage(rootDir);
    await assertJavaVersionSatisfies(requiredRange);
    const javaHome = await getJenvJavaHome(requiredRange);
    await buildCompiler(vendorDir, outputDir, bazelTarget, jarName, javaHome);
    process.exit(0);
  } catch (err) {
    console.error("❌ Build failed:", err.message);
    throw err;
  }
})();

/**
 * Reads the Java engine version from package.json
 * @param {string} rootDir
 * @returns {Promise<string>}
 */
async function getRequiredJavaVersionFromPackage(rootDir) {
  const packageJsonPath = path.join(rootDir, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
  const requiredRange = packageJson.engines?.java;
  if (!requiredRange) {
    throw new Error(`No "engines.java" field found in package.json.`);
  }
  return requiredRange;
}

/**
 * Asserts that the installed Java version satisfies the required semver range
 * @param {string} requiredRange
 */
async function assertJavaVersionSatisfies(requiredRange) {
  const { stderr = "", stdout = "" } = await execJavaCommand(["-version"]);
  const output = stderr || stdout;

  const match = output.match(/version "(1\.)?(\d+)(\.\d+)?(\.\d+)?/);
  if (!match) {
    throw new Error(`Could not determine installed Java version:\n${output}`);
  }

  const major = match[2];
  const minor = match[3] ? match[3].slice(1) : "0";
  const patch = match[4] ? match[4].slice(1) : "0";
  const actualVersion = `${major}.${minor}.${patch}`;

  if (!semver.satisfies(actualVersion, requiredRange)) {
    throw new Error(
      [
        `Java version mismatch.`,
        `Required: ${requiredRange}`,
        `Found: ${actualVersion}\n`,
        `Please install a Java version that satisfies the required range and ensure it's the default "java" in your PATH.`,
      ].join("\n"),
    );
  }

  console.log(
    `✅ Java ${actualVersion} satisfies required range: ${requiredRange}`,
  );
}

/**
 * Gets JAVA_HOME from jenv for the given version prefix
 * @param {string} versionRange
 * @returns {Promise<string>}
 */
async function getJenvJavaHome(versionRange) {
  const major = semver.minVersion(versionRange)?.major;
  if (!major) {
    throw new Error(
      `Could not resolve major version from range: ${versionRange}`,
    );
  }

  const { stdout } = await spawnWithCapture("jenv", ["prefix", `${major}`]);
  const javaHome = stdout.trim();
  if (!javaHome) {
    throw new Error(`Could not resolve JAVA_HOME for jenv version: ${major}`);
  }

  console.log(`🔧 JAVA_HOME resolved via jenv: ${javaHome}`);
  return javaHome;
}

/**
 * Runs Bazel to build the deploy jar and copies it to the compiler directory
 * @param {string} vendorDir
 * @param {string} outputDir
 * @param {string} bazelTarget
 * @param {string} jarName
 * @param {string} javaHome
 */
async function buildCompiler(
  vendorDir,
  outputDir,
  bazelTarget,
  jarName,
  javaHome,
) {
  console.log("🚀 Running Bazel build...");

  await spawnWithCapture("bazel", ["build", bazelTarget], {
    cwd: vendorDir,
    stdio: "inherit",
    env: {
      ...process.env,
      JAVA_HOME: javaHome,
    },
  });

  const builtJarPath = path.join(
    vendorDir,
    "bazel-bin",
    "java/src/com/google/template/soy",
    jarName,
  );

  try {
    await fs.access(builtJarPath);
  } catch {
    throw new Error(`Expected output not found: ${builtJarPath}`);
  }

  await fs.mkdir(outputDir, { recursive: true });
  const destPath = path.join(outputDir, jarName);
  await fs.copyFile(builtJarPath, destPath);

  console.log(`✅ Compiler built and copied to: ${destPath}`);
}

/**
 * Executes a java command using the system's "java" binary
 * @param {string[]} args
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
function execJavaCommand(args) {
  return spawnWithCapture("java", args);
}

/**
 * Promisified spawn with stdout/stderr capture
 * @param {string} cmd
 * @param {string[]} args
 * @param {import('child_process').SpawnOptions} [opts]
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
function spawnWithCapture(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: ["ignore", "pipe", "pipe"],
      ...opts,
    });

    let stdout = "";
    let stderr = "";

    if (child.stdout) child.stdout.on("data", (chunk) => (stdout += chunk));
    if (child.stderr) child.stderr.on("data", (chunk) => (stderr += chunk));

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${cmd} exited with code ${code}`));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
