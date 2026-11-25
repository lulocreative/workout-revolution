# CLAUDE CODE TASK: Add Food & Recovery to Workout Revolution 2.0

You are inside the existing `workout-revolution-2` repository. Read `AGENTS.md`, `README.md`, `DATA_PROVENANCE.md`, `app.js`, `data/seed.js`, `lib/storage.js`, and `sw.js` before coding. The user has a bespoke, fully functional vanilla JavaScript strength-training PWA. **Extend it, never rebuild it.**

## Attached source-of-truth inputs
- `nutrition.seed.json`: recipe library, exact ingredient portions, approximate nutrition, 7-day examples, meal swaps, user-specific constraints, flexibility rules and tracking rules.
- `nutrition-plan.md`: readable explanation, detailed recipes, shopping list, provenance and evidence corrections.

## Build requirements
1. Add a clean **Food** navigation item using the existing app’s styling, desktop and mobile responsiveness and accessible controls.
2. Build Today: show planned meals and their full recipe instructions, portions and protein estimates. Use actual workout records and a user-selected upcoming session to decide whether to show training tips, never hard-code Monday as Pull.
3. Build Recipes: breakfast/lunch/dinner/snack filter; search; select recipe; servings multiplier (0.5, 1, 2, 3, 4); editable portions; display approximate nutrition with a clearly visible `Estimate` label; cooking instructions and preparation time.
4. Build Week: display seven-day example with easy meal substitution. A replacement must update that day's shopping list and nutrition totals. Never treat flexible restaurant meals as zero macros.
5. Build Shopping list: aggregate the current week’s ingredients by canonical food ID. Separate cooked chicken from raw purchases or convert with an explicitly labeled estimate. Group by supermarket aisle, optionally check off items and make it copyable.
6. Build Food journal: mark a recipe as eaten for a specific date with optional serving adjustment, or enter a custom free meal and unknown nutrition. **Planned != eaten.** The app must never present seed meals as verified user consumption.
7. Add a small body-composition/bloating tracker with optional morning weight, waist, digestive comfort and trigger notes. Be calm and nonjudgmental. No automatic calorie diagnosis.
8. Integrate persisted `nutrition` data into the existing local-first storage scheme. Upgrade migrations and backups so older Workout Revolution 2.0 exports still import without losing gym history, workouts, photos or measurements. Exported backups must also contain nutrition logs.
9. Update PWA cache version and offline assets so Food works without a network after first load. Do not send private data to external services.
10. Add meaningful automated tests (nutrition recipe lookup; aggregate ingredient quantities; servings multiplier; unknown macros propagate as unknown; history preservation and backup migration). Run `npm test`. Check the mobile screen around 390px width.

## Nutrition guardrails
- Target ~140–160 g protein most days; 130 g sometimes is not failure. No strict calorie target yet. Do not turn the UI into a calorie-policing app.
- The user is lactose intolerant. Lactose-free dairy by default. Do not silently replace it with regular Greek yogurt, milk or whey concentrate.
- Keep the user's staple foods: tuna pasta with tomato, eggs, rice, salmon, chicken, potatoes, wholegrain bread, dark chocolate, social meals.
- No mandatory 2-scoop protein shake or 30-minute post-workout deadline. A single scoop is optional when convenient.
- Separate training day from rest day meal advice; allow flexible scheduling and travel.
- Do not hard-code the sample week as a lived/verified food history. Do not show null nutrition as zero.
- Avoid unsupported promises about cortisol, sodium, belly fat or symptom cures. If the user reports concerning dizziness or GI symptoms, recommend appropriate follow-up; the app does not diagnose.

## Final acceptance
- Existing Push/Pull/Legs/Focus program still works exactly as before; no random set or exercise changes.
- Nutrition data is separated from confirmed actual training records.
- All existing tests and the new nutrition tests pass.
- Food module matches current app visual language and is genuinely usable on mobile.
- README documents new features and backup behavior, and include a summary of exact files changed.
