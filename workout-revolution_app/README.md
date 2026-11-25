# Workout Revolution 2.0

**A personal, offline-first strength-training app built around actual workout history.**

Designed for one real athlete, not a generic fitness template. The current program prioritizes chest, biceps, forearms, traps and leg development. It keeps familiar movements and tracks the exact machine/setup so a different pulldown stack doesn't get treated as the same lift.

## Open this project in Codex

1. Unzip `Workout_Revolution_2_Codex_Project.zip`.
2. Open the `workout-revolution-2` folder as a project/workspace in Codex.
3. In the project terminal, run:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:4173` in your browser.

No `npm install`, API key, cloud account or external library is needed. Node 18+ is required. In Codex, read `AGENTS.md` before making changes.

### Test

```bash
npm test
```

The tests cover load progression, machine comparison, incomplete records, RIR, stop signals, and plateau detection.

## What is implemented

- **Overview:** Next workout, weekly training count, focus areas, SATS annual and 30-day aggregate statistics, latest logged performance.
- **Train:** Push, Pull, Legs, or optional fourth Focus day. Pre-session readiness screen; actual per-set weight, reps, RIR, rest, form, unusual fatigue, pain, discomfort and dizziness; per-exercise rest timer; session resume after browser refresh.
- **Progression coach:** Uses the same exercise *and machine setup*. Adds reps before load, increases the smallest increment only when every full work set reaches the target with RIR at least 1, highlights three consecutive stalls, and blocks automatic progression when symptoms or form issues are recorded. Every recommendation explains the evidence. This is a deterministic rules engine, not a live AI chat.
- **Program:** Preserves known priorities, a three-session core and a readiness-dependent optional fourth. Adjust set count only by giving a reason; the change is audited.
- **History:** Seven partially reconstructed dated November/October sessions. Unknown actual set data remains unknown. Add any personally verified historical set manually.
- **Progress:** Working-load chart by machine, weight/waist/arm measurements, optional device-local progress photos.
- **Settings:** JSON backups, restore, local reset, core-session target.
- **PWA:** When hosted on HTTPS, can be installed to the home screen with offline caching. Works without a server after its first load, subject to browser/device storage rules.

## Food & Recovery (added 25 Nov 2026)

A **Food** tab sits next to Train. It is a planning and journaling aid, not a diet: every number is an estimate, and only meals you log count as eaten.

- **Today** shows today's planned meals with full recipes, portions and protein estimates. Training or rest tips come from your **logged workout** for today, then your own choice (Pull / Push / Legs / Chest + Arms / Rest chips), then the weekly plan. "I ate this" writes a dated journal entry; planned meals are never logged automatically.
- **Week** is the 7-day example from `data/nutrition.seed.json`. Swap any meal for another of the same type; that day's totals and the shopping list update. The flexible social dinner keeps **unknown** nutrition and is shown as "+ 1 meal unknown", never zero.
- **Recipes**: breakfast / lunch / dinner / snack filter, search, servings ×0.5–4, editable portions per serving, approximate nutrition with an **Estimate** label, method, swaps and batch-prep notes, and "Log as eaten" on a chosen date.
- **Shopping** adds up this week's ingredients by food ID for 1–4 people, grouped by aisle, with check-offs and a copy button. Leftover cooked chicken is listed separately (cooked weight) with a labelled raw-weight estimate.
- **Journal**: log a recipe with servings, or a free meal where protein/kcal can stay blank (unknown, not zero). Dark chocolate has a one-tap entry.
- **Body**: optional morning weight, waist, bloating 0–10, possible triggers and notes. No diagnosis or calorie targets; the text points to a doctor for persistent or worrying symptoms.
- Lactose-free dairy is the default in every recipe. Protein guidance is a flexible ~140–160 g/day (130 g is fine).

### Backups and older data
All food data lives in `state.nutrition` in the same local storage and the same JSON backup as your workouts. `migrateState`/`prepareImport` in `lib/storage.js` add empty nutrition defaults to older backups and saved data **without changing** gym history, the active workout, photos or measurements. New exports include nutrition logs. Everything stays on the device; nothing is sent anywhere.

### Files changed for Food & Recovery
- New: `data/nutrition.seed.json` (source of truth), `data/nutrition.js` (generated: `npm run nutrition:build`), `lib/nutrition.js` (pure logic), `food-view.js` (screen), `tests/nutrition.test.mjs`, `nutrition-plan.md`, `CLAUDE_CODE_TASK.md`.
- Changed: `app.js` (Food menu item, routing, events, sheet), `lib/storage.js` (nutrition defaults, migration, backup payload), `styles.css` (Food styles), `sw.js` (offline cache v2.24.0 with the Food files), `scripts/build-public.mjs` (publishes Food without personal history), `package.json` (`nutrition:build` script), `DATA_PROVENANCE.md`, `README.md`.
- Not changed: workout program, exercises, sets, progression rules, history.

## Data you should understand before using it

**107 workouts over 12 months and 8 over 30 days** come from a SATS screenshot captured 20 November 2026. The app has **7 dated historical records**, most of them partial. It does NOT pretend to contain all 107 workouts. The weekly count is computed from available dated entries and is not a complete lifetime history.

The archived March–July 2026 program is preserved as context, but the current proposals reflect newer November reports. New exercises such as dumbbell preacher curls and some equipment loads are marked provisional until actual sets are logged. Read `DATA_PROVENANCE.md` for a detailed source map.

## Personal and medical data

Data is saved in `localStorage` on the device/browser where you use the app. Photos are resized and also stored on that device. **There is no authentication, encryption, automatic backup or cloud synchronization.** Export JSON regularly. A backup may include sensitive information and photos, so store it privately.

The app is not a medical device. Past dizziness during some lifts led to a readiness check, stop signals and no default Romanian deadlifts. Active dizziness, faintness, chest pain or unusual severe symptoms warrant stopping exercise and appropriate medical evaluation. A rules engine cannot determine medical readiness by itself.

## File guide

- `index.html`, `styles.css`, `app.js`: Interactive responsive app.
- `data/seed.js`: Program template, historical inputs and provenance notes.
- `lib/coach.js`: Program decision logic.
- `lib/storage.js`: Browser persistence and backup.
- `server.mjs`: Zero-dependency local server.
- `sw.js`, `manifest.webmanifest`, `assets/`: PWA assets.
- `AGENTS.md`: Instructions for Codex or another code assistant to maintain data integrity and app behavior.
- `tests/coach.test.mjs`: Coach rule regression suite.

## Deploying for personal iPhone use

Deploy this static project to any HTTPS static host (for example GitHub Pages, Cloudflare Pages or Netlify). On iPhone, open the HTTPS URL in Safari and choose **Share → Add to Home Screen**. Your data is local to that installed/browser origin and will **not** automatically transfer from localhost or from another device. First import a JSON backup on the new origin.

## Known boundaries / future Codex work

The first version is an actual usable single-user web app, not a published App Store build. It has no SATS auto-import, HealthKit integration, login, sync across devices, live LLM coaching, or push notifications. See `NEXT_STEPS.md` for suggested additions, prioritised by user value.
