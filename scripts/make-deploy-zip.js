// Builds the Hostinger deploy zip.
//
// Do not use PowerShell's Compress-Archive for this. On Windows PowerShell 5.1
// it writes entry names with backslashes, stores directories as zero-byte
// files, and records no Unix mode — so the host extracts app/ with no execute
// bit and `next build` dies with:
//
//   Error: EACCES: permission denied, scandir '.../app/api/checkout'
//
// scripts/zip-lib.js writes forward slashes, real directory entries, and
// 0755/0644 modes instead. Run this with `npm run zip`.
const fs = require("fs");
const path = require("path");
const { collect, writeZip } = require("./zip-lib");

const ROOT = process.argv[2] || path.join(__dirname, "..");
const OUT = process.argv[3] || path.join(ROOT, "kova-storefront-deploy.zip");

const INCLUDE_DIRS = ["app", "components", "data", "lib", "public"];
const INCLUDE_FILES = [
  ".env.local.example",
  "jsconfig.json",
  "middleware.js",
  "next.config.mjs",
  "package.json",
  "package-lock.json",
  "postcss.config.mjs",
  "tailwind.config.js",
];
// The host runs `npm install && npm run build`, so build output and deps stay
// out. .env.local stays out too — those go in the Hostinger panel.
const EXCLUDE = new Set([".next", "node_modules", ".git", ".vercel", ".env.local"]);
const EXCLUDE_RE = /(\.disabled|\.zip)$/;
const skip = (name) => EXCLUDE.has(name) || EXCLUDE_RE.test(name);

const entries = [];
for (const rel of [...INCLUDE_DIRS, ...INCLUDE_FILES]) {
  if (fs.existsSync(path.join(ROOT, rel))) collect(ROOT, rel, { skip, entries });
}

const { entries: n, bytes } = writeZip(entries, OUT);
console.log(`${OUT}: ${n} entries, ${(bytes / 1048576).toFixed(1)} MB`);
