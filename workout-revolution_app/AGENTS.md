# Codex instructions: Workout Revolution 2.0

## Product contract

Build an athlete-specific training app. The owner wants independent, evidence-based decisions, not a bot that changes opinions when questioned. Display why a workout or progression decision was made, including the last comparable actual set, recovery information, exact machine and confidence.

## Non-negotiable data rules

1. Always distinguish **actual logged work**, **user-reported historical partial work**, and **prescribed/planned loads**. Never auto-create fake past sets. Missing reps, RIR, rest, symptoms or completion stay null/unknown.
2. Track local date in `Europe/Oslo`, workout type, exercise ID, exact machine/setup, weight units (kg total or per hand/side), sets, reps, RIR, actual rest when known, planned rest separately, performance notes, form issues, pain/discomfort, dizziness and unusual fatigue.
3. Compare only the same exercise and the same machine/setup. Different lat pulldown machines, or lying curls versus seated extensions, are not interchangeable baselines.
4. Preserve the user's favorite cable lateral raises (normally three sets), Smith shrugs, V-handle pushdowns, lying leg curls and regular compound lifts. Do not change exercises just for novelty.
5. The owner dislikes RDLs due to previous dizziness. Do not insert them by default. Active dizziness, pain or near-fainting should stop the workout flow and advise appropriate assessment, not a guaranteed safe adaptation.
6. Prefer rep progression first. Increase load only when all required comparable work sets clear their upper target with enough RIR and no issue flags. When three comparable exposures stall, recommend review rather than automatic movement swaps.
7. Follow the owner's weekly plan (set 24 Nov 2026): Monday Pull, Tuesday Push, Wednesday rest, Thursday Legs, Friday rest, Saturday Chest + Arms (the `focus` session), Sunday rest. The app suggests today's planned workout, or the next planned day on rest days (`plannedWorkout` in lib/coach.js). Don't add extra sessions on top of this plan without the owner asking.
8. When changing sets, loads or exercises, show a clear rationale with measurable reason. Log voluntary plan edits in `changeLog`.
9. Do not infer physique changes from 107 SATS visits. Only seven detailed historical entries are available from conversation; SATS screenshot supplies aggregates only.
10. Workout UI is thumb-friendly and exercise-by-exercise. Show the current set and its exact target. Do not bury the rest time or RIR.

## Current seed and source precedence

1. Latest user-confirmed actuals, e.g. 20 Nov 2026 incline DB 22.5 kg per hand for two sets of 8, override earlier generic schedules.
2. Recent reports and machine-specific comparisons, including 18 Nov 45-degree leg press 250 kg ×5 twice and 17 Nov cable row 80 kg ×8.
3. March–July 2026 program DOCX is historical planning context, not reliable current working weights.
4. Default algorithm proposals must always be visibly labelled when no comparable baseline exists.

## Engineering rules

- This repository uses modern ECMAScript, native browser features, zero third-party runtime dependencies and a tiny Node static server.
- Use semantic HTML, keyboard-accessible controls, WCAG-minded contrast/touch sizing, responsive desktop and iPhone layouts, and reduced-motion behavior.
- Keep sensitive data local by default. Do not add telemetry, cloud analytics or remote calls without explicit owner approval.
- Do not sync physique photos or health data to an external service without explicit approval and clear consent.
- Add tests in `tests/coach.test.mjs` for every changed progression/safety condition.
- Run `npm test` before claiming a change is done. If you alter the UI, verify both 390px and 1440px layouts and exercise logging flow.
- Avoid performance theater and generic AI motivational copy. Clear labels and actual evidence matter more than dashboards packed with invented scores.
