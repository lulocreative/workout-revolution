// Builds a privacy-safe copy of the app for public hosting (GitHub Pages).
// Personal data (body stats, workout history, measurements, health notes) is NOT included:
// the hosted app starts empty and the owner restores their own JSON backup on the device.
//   node scripts/build-public.mjs [outDir] [backupFile]
import { mkdir, rm, readFile, writeFile, cp, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROGRAM, PROFILE, HISTORY, INITIAL_MEASUREMENTS } from '../data/seed.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] || join(root, 'dist');
const backupPath = process.argv[3] || null;

// Text that would reveal health history in the public code -> neutral wording.
const SCRUB = [
  ['Avoid RDL given past dizziness.', 'RDLs are deliberately not programmed.'],
  ['Holding your breath; you had brief dizziness after curls on 31 Oct.', 'Holding your breath.'],
  ['Your training history includes previous brief dizziness during heavy lifts/curls. New sessions require a readiness check.', 'New sessions require a readiness check.'],
  ['The athlete has had brief dizziness during heavy lifts/curls. Do not suggest Romanian deadlifts.', 'Do not suggest Romanian deadlifts. Check the athlete data for any history of dizziness.'],
  ['Romanian deadlifts after dizziness', 'Romanian deadlifts'],
  ["Breathing cues deliberately avoid long breath-holds given the owner's history of brief dizziness.", 'Breathing cues deliberately avoid long breath-holds.']
];
const scrub = (text) => SCRUB.reduce((t, [a, b]) => t.split(a).join(b), text);

const publicProfile = {
  ...PROFILE,
  heightCm: null, weightKg: null, weightAsOf: null,
  baselineNote: 'Restore your backup in Settings to load your data.',
  avoid: PROFILE.avoid.map(scrub),
  sats: { annual107: 0, last30: 0, asOf: null },
  photoDates: []
};

await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'data'), { recursive: true });

for (const f of ['index.html', 'app.js', 'food-view.js', 'styles.css', 'sw.js', 'manifest.webmanifest']) {
  await writeFile(join(out, f), scrub(await readFile(join(root, f), 'utf8')));
}
for (const d of ['lib', 'assets']) await cp(join(root, d), join(out, d), { recursive: true });
for (const f of await readdir(join(out, 'lib'))) {
  const p = join(out, 'lib', f); await writeFile(p, scrub(await readFile(p, 'utf8')));
}
await writeFile(join(out, 'data', 'technique.js'), scrub(await readFile(join(root, 'data', 'technique.js'), 'utf8')));
// Nutrition seed: recipes and plan are fine to publish; the personal history (weight, health notes) is not.
{
  const { NUTRITION } = await import('../data/nutrition.js');
  const pub = JSON.parse(JSON.stringify(NUTRITION));
  pub.sourceProvenance = { confidence: pub.sourceProvenance?.confidence || '', corrections: pub.sourceProvenance?.corrections || [] };
  if (pub.goal?.proteinTargetG) pub.goal.proteinTargetG.note = 'Flexible daily range consistent with the broad 1.4–2.0 g/kg sports-nutrition range for healthy exercising adults.';
  await writeFile(join(out, 'data', 'nutrition.js'), `// Public build: personal history removed.\nexport const NUTRITION = ${JSON.stringify(pub)};\n`);
}
await writeFile(join(out, 'data', 'seed.js'),
  `// Public build: no personal data. Restore your JSON backup in Settings.\n` +
  `export const PROGRAM = ${scrub(JSON.stringify(PROGRAM, null, 1))};\n` +
  `export const PROFILE = ${JSON.stringify(publicProfile, null, 1)};\n` +
  `export const HISTORY = [];\nexport const INITIAL_MEASUREMENTS = [];\n`);
await writeFile(join(out, '.nojekyll'), '');

// Personal backup, written OUTSIDE the public folder, in the app's own backup format.
if (backupPath) {
  const backup = { version: 1, profile: PROFILE, history: HISTORY, measurements: INITIAL_MEASUREMENTS, photos: [], active: null,
    lastReadiness: null, programOverrides: {}, changeLog: [], videoLinks: {}, chat: [], view: 'overview',
    selectedPlan: 'push', selectedMetric: 'incline-db|db-bench-30', exportedAt: new Date().toISOString() };
  await writeFile(backupPath, JSON.stringify(backup, null, 2));
}
console.log(`Public build written to ${out}${backupPath ? `; personal backup at ${backupPath}` : ''}`);
