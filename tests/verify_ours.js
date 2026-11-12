// Node must decode what our deflate wrote, byte for byte.
const z = require('zlib'), fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'vec'); let bad = 0, n = 0;
for (const name of fs.readFileSync(path.join(dir, 'cases.txt'), 'utf8').split('\n')) {
  const orig = fs.readFileSync(path.join(dir, name + '.orig'));
  const chk = (f, fn) => { n++; try { if (!fn(fs.readFileSync(path.join(dir, f))).equals(orig)) { bad++; console.log('MISMATCH', f); } } catch (e) { bad++; console.log('NODE REJECTS', f, e.message); } };
  for (const l of [0, 1, 6, 9]) { chk(`${name}.ours.z${l}`, z.inflateSync); chk(`${name}.ours.raw${l}`, z.inflateRawSync); }
  chk(`${name}.ours.gz`, z.gunzipSync);
}
const sizes = ['text', 'mixed', 'zeros'].map(c => `${c}: ours ${fs.statSync(path.join(dir, c + '.ours.z6')).size} vs node ${fs.statSync(path.join(dir, c + '.z6')).size}`);
console.log(`node verified ${n - bad}/${n} of our streams;`, sizes.join('; '));
process.exit(bad ? 1 : 0);
