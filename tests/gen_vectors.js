// Reference vectors from Node's zlib: inputs + their compressed forms at several levels.
const z = require('zlib'), fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'vec');
fs.mkdirSync(dir, { recursive: true });
let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) >>> 8;
const text = Buffer.from(('The quick brown fox jumps over the lazy dog. '.repeat(40) + 'pack my box with five dozen liquor jugs. ').repeat(60));
const random = Buffer.from(Array.from({ length: 100000 }, () => rnd() & 255));
const mixed = Buffer.concat([text, random.subarray(0, 5000), text, Buffer.alloc(70000, 7)]);
const cases = { empty: Buffer.alloc(0), one: Buffer.from('a'), short: Buffer.from('hello hello hello hello'), text, random, zeros: Buffer.alloc(1 << 20), mixed };
for (const [n, b] of Object.entries(cases)) {
  fs.writeFileSync(path.join(dir, n + '.orig'), b);
  for (const l of [0, 1, 6, 9]) {
    fs.writeFileSync(path.join(dir, `${n}.z${l}`), z.deflateSync(b, { level: l }));
    fs.writeFileSync(path.join(dir, `${n}.raw${l}`), z.deflateRawSync(b, { level: l }));
  }
  fs.writeFileSync(path.join(dir, n + '.gz'), z.gzipSync(b));
}
fs.writeFileSync(path.join(dir, 'cases.txt'), Object.keys(cases).join('\n'));
console.log('vectors for', Object.keys(cases).join(','));
