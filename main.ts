// HomeLedger — a household budget site: this main.ts hands in the site in app/ together with
// its screenshots/ captures, and writes the dossier.json summary the judge reads. The check
// at the bottom re-reads that dossier and prints its screenshot count and byte length.
// A working best-site-01 entry (Node 22, standard library only): the site is this directory's app/ folder, plain
// static files a browser opens at app/index.html (ES modules, CSS, no build step), its content held in its own files:
// nothing it runs, styles or shows loads over the network. The program hands it in: it copies app/ and screenshots/
// from beside this file to /output and writes /output/dossier.json, the summary the judge reads (your screenshots, the
// first load's files and bytes, and your source), with the vendored make.fun library. Leave vendor/makefun-frontend.ts
// as it is: the scorer requires dossier.json to be byte for byte what its own copy writes.
//
// A starting point, not a winner: a plain recipe collection, a list of recipes and a page for each. Build the site the
// brief asks for in app/ (its content, ease of use, a phone layout, its look), put 3 or 4 PNG or JPEG screenshots of
// it running in screenshots/ (the first by name is the cover; one may be a 390 x 844 phone view; shots.json says which
// views this starter's were taken of), and run it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';
import { readFileSync } from 'node:fs';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
// Copy screenshots but never emit a dotfile path: the grader's output must hold only
// plain relative names, so skip any entry whose name starts with '.' (e.g. .gitkeep).
if (existsSync(join(here, 'screenshots')))
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), {
    recursive: true,
    filter: (src) => !basename(src).startsWith('.'),
  });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// Verify the dossier just written: read it back, parse it, and print a one-line summary
// (screenshot count and byte length). Read-only — this changes no output file.
const dossierText = readFileSync(join(out, 'dossier.json'), 'utf8');
const dossier = JSON.parse(dossierText) as { images?: unknown[] };
console.log(`HomeLedger dossier: ${dossier.images?.length ?? 0} screenshots, ${dossierText.length} bytes`);
