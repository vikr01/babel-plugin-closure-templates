// @ts-check

const path = require("path");
const fs = require("fs");
const process = require("process");
const tiged = require("tiged");

const rootDir = path.join(path.dirname(require.resolve("../package.json")));
const isNpm = !!process.env.npm_config_user_agent?.startsWith("npm/");
const isRootInstall = process.env.INIT_CWD === rootDir;

if (!isNpm || !isRootInstall) {
  process.exit(0); // silently skip
}

const pkg = require("../package.json");
/** @type {{ gitDeps?: Record<string, { repo: string, tag: string }> }} */
const { gitDeps = {} } = pkg;

const outDir = path.join(rootDir, "vendor");
const lockPath = path.join(outDir, ".gitdeps.lock.json");

fs.mkdirSync(outDir, { recursive: true });

let lock = {};
if (fs.existsSync(lockPath)) {
  try {
    lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  } catch {
    // corrupted lock, ignore
  }
}

const updatedLock = { ...lock };
let skipped = 0;

Promise.all(
  Object.entries(gitDeps).map(async ([name, { repo, tag }]) => {
    const prev = lock[name];
    const targetPath = path.join(outDir, name);

    if (prev?.repo === repo && prev?.tag === tag && fs.existsSync(targetPath)) {
      skipped++;
      return;
    }

    console.log(`Installing ${name} from ${repo}@${tag}...`);
    fs.rmSync(targetPath, { recursive: true, force: true });

    const template = `${repo}#${tag}`;
    const clone = tiged(template, {
      noCache: true,
      force: true,
      verbose: true,
    });

    await clone.clone(targetPath);
    updatedLock[name] = { repo, tag };
  }),
)
  .then(() => {
    const total = Object.keys(gitDeps).length;
    const installed = total - skipped;
    console.log(
      `✅ Installed ${installed} package${installed === 1 ? "" : "s"}.`,
    );
    if (skipped > 0) {
      console.log(
        `⏩ Skipped ${skipped} up-to-date package${skipped === 1 ? "" : "s"}.`,
      );
    }
    fs.writeFileSync(lockPath, JSON.stringify(updatedLock, null, 2) + "\n");
    process.exit(0);
  })
  .catch((err) => {
    throw err;
  });
