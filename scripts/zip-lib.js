// Minimal zip writer that produces archives a Linux host can actually read:
// forward-slash entry names, real directory entries, and Unix 0755/0644 modes.
//
// Windows zip tools (notably PowerShell 5.1's Compress-Archive) get all three
// wrong, which is how a deploy ended up with app/api unreadable and `next build`
// dying on EACCES. Shared by make-deploy-zip.js and zip-plugin.js.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function dosTime(d) {
  const time = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() / 2)) & 0xffff;
  const date = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;
  return { time, date };
}

/**
 * Walk `rel` (relative to `root`) collecting zip entries.
 *
 * `prefix` is prepended to every entry name — a WordPress plugin zip needs its
 * files under a single top-level folder, which is what that is for.
 * `skip(name)` is called with each basename and returns true to exclude it.
 */
function collect(root, rel, { prefix = "", skip = () => false, entries = [] } = {}) {
  const abs = path.join(root, rel);
  const st = fs.statSync(abs);
  const name = path.join(prefix, rel).split(path.sep).join("/");

  if (st.isDirectory()) {
    entries.push({ name: name + "/", dir: true, mtime: st.mtime });
    for (const child of fs.readdirSync(abs).sort()) {
      if (skip(child)) continue;
      collect(root, path.join(rel, child), { prefix, skip, entries });
    }
  } else if (st.isFile()) {
    entries.push({ name, dir: false, mtime: st.mtime, data: fs.readFileSync(abs) });
  }
  return entries;
}

function writeZip(entries, out) {
  const local = [];
  const central = [];
  let offset = 0;

  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8");
    const raw = e.dir ? Buffer.alloc(0) : e.data;
    const crc = e.dir ? 0 : crc32(raw);
    const deflated = e.dir ? Buffer.alloc(0) : zlib.deflateRawSync(raw, { level: 9 });
    const useDeflate = !e.dir && deflated.length < raw.length;
    const body = useDeflate ? deflated : raw;
    const method = useDeflate ? 8 : 0;
    const { time, date } = dosTime(e.mtime);

    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4); // version needed
    lfh.writeUInt16LE(0x0800, 6); // UTF-8 names
    lfh.writeUInt16LE(method, 8);
    lfh.writeUInt16LE(time, 10);
    lfh.writeUInt16LE(date, 12);
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(body.length, 18);
    lfh.writeUInt32LE(raw.length, 22);
    lfh.writeUInt16LE(name.length, 26);
    lfh.writeUInt16LE(0, 28);
    local.push(lfh, name, body);

    const mode = e.dir ? 0o40755 : 0o100644;
    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(0x031e, 4); // made by: Unix (3) — this is what carries the mode
    cdh.writeUInt16LE(20, 6);
    cdh.writeUInt16LE(0x0800, 8);
    cdh.writeUInt16LE(method, 10);
    cdh.writeUInt16LE(time, 12);
    cdh.writeUInt16LE(date, 14);
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(body.length, 20);
    cdh.writeUInt32LE(raw.length, 24);
    cdh.writeUInt16LE(name.length, 28);
    cdh.writeUInt16LE(0, 30); // extra
    cdh.writeUInt16LE(0, 32); // comment
    cdh.writeUInt16LE(0, 34); // disk
    cdh.writeUInt16LE(0, 36); // internal attrs
    cdh.writeUInt32LE((((mode << 16) | (e.dir ? 0x10 : 0)) >>> 0), 38); // external attrs
    cdh.writeUInt32LE(offset, 42);
    central.push(cdh, name);

    offset += 30 + name.length + body.length;
  }

  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  fs.writeFileSync(out, Buffer.concat([...local, centralBuf, eocd]));
  return { entries: entries.length, bytes: fs.statSync(out).size };
}

module.exports = { collect, writeZip };
