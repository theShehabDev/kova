// Zips a WordPress plugin directory for upload.
//
//   npm run zip:plugin kova-batches
//   node scripts/zip-plugin.js woocommerce/kova-batches [out.zip]
//
// Files land under a single top-level folder named after the directory, which
// is what WordPress requires of a plugin zip. See scripts/zip-lib.js for why we
// don't use Compress-Archive.
const fs = require("fs");
const path = require("path");
const { collect, writeZip } = require("./zip-lib");

const ROOT = path.join(__dirname, "..");

let target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/zip-plugin.js <plugin-dir> [out.zip]");
  process.exit(1);
}
// Bare name is taken as a plugin under woocommerce/.
if (!fs.existsSync(path.resolve(ROOT, target))) {
  target = path.join("woocommerce", target);
}

const dir = path.resolve(ROOT, target);
if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
  console.error(`not a directory: ${dir}`);
  process.exit(1);
}

const slug = path.basename(dir);
const out = process.argv[3]
  ? path.resolve(ROOT, process.argv[3])
  : path.join(path.dirname(dir), `${slug}.zip`);

// Editor litter and VCS metadata only; everything else the plugin ships with
// is kept, since a WordPress plugin zip is the whole plugin.
const SKIP = new Set([".git", ".DS_Store", "node_modules", "Thumbs.db"]);

const entries = collect(path.dirname(dir), slug, { skip: (name) => SKIP.has(name) });
const { entries: n, bytes } = writeZip(entries, out);
console.log(`${out}: ${n} entries, ${(bytes / 1024).toFixed(1)} KB`);
