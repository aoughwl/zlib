> **Moved.** This library now lives in [aoughwl/std](https://github.com/aoughwl/std/tree/main/zlib) (directory `zlib/`), with its full history. This repository is kept as a redirect; new work happens in `aoughwl/std`.

# zlib

DEFLATE (RFC 1951), zlib (RFC 1950) and gzip (RFC 1952) for the aoughwl stack, **written from
scratch in aowl**: no C library, no `dynlib`, so it works on Windows and anywhere else aowlmony does.

```nim
import zlib

let z = zlibCompress("hello hello hello")
let r = zlibDecompress(z)               # r.status == zOk, r.data == "hello hello hello"
let g = gzipDecompress(gz, maxSize = 8 * 1024 * 1024)
echo crc32("123456789"), " ", adler32("Wikipedia")
```

| | |
|---|---|
| inflate | `inflateRaw`, `zlibDecompress`, `gzipDecompress`. Stored, fixed and dynamic Huffman blocks. Adler-32 / CRC-32 and length trailers verified. Bounded by `maxSize` (default 256 MiB). |
| deflate | `deflateRaw`, `zlibCompress`, `gzipCompress`. LZ77 (hash chains, 32 KiB window) with the **fixed** Huffman code; level 0 or incompressible data falls back to stored blocks, so output is never larger than stored. |
| checksums | `crc32` (seedable), `adler32` |
| errors | status values (`zBadHeader`, `zBadData`, `zTruncated`, `zTooBig`, `zBadChecksum`), never exceptions |

**Limits:** deflate does not build dynamic Huffman tables yet, so its ratio is below real zlib's
(roughly 1.5-2x larger on text, much larger on long runs); the output is always valid. Inflate is complete.
Whole-buffer API only (no streaming).

## Tests

`tests/gen_vectors.js` makes reference streams with Node's zlib (levels 0/1/6/9, raw/zlib/gzip, seven
inputs including empty, random and 1 MiB of zeros). `tests/tzlib.aowl` must decode all of them and
round-trip its own output; `tests/verify_ours.js` then has Node decode every stream we wrote.

    node tests/gen_vectors.js
    cd tests && ../../_hello/abuild.sh tzlib.aowl tzlib.exe     # or any aowlmony build of tests/mony.toml
    ./tzlib.exe && node verify_ours.js
