import test from 'node:test'; import assert from 'node:assert/strict';
import { getRecipe, findRecipes, scaleRecipe, sumNutrition, weekPlan, shoppingList, shoppingText, customJournalEntry, journalEntryFromRecipe, proteinForDate, dayContext, migrateNutrition, mealFromItems, mealFeedback, builtJournalEntry, DEFAULT_MY_MEALS } from '../lib/nutrition.js';
import { migrateState, prepareImport, backupPayload, freshState } from '../lib/storage.js';
import { NUTRITION } from '../data/nutrition.js';

const flat = (groups) => Object.fromEntries(groups.flatMap(g => g.items.map(i => [i.foodId, i])));

test('recipe lookup and search', () => {
  assert.equal(getRecipe('lunch-tuna-pasta').name, 'Tuna and tomato pasta');
  assert.equal(getRecipe('does-not-exist'), null);
  assert.ok(findRecipes({ category: 'snack' }).every(r => r.category === 'snack'));
  assert.ok(findRecipes({ query: 'salmon' }).length >= 2);
  assert.equal(NUTRITION.recipes.length, 19);
});

test('servings multiplier scales ingredients and nutrition; edits are flagged', () => {
  const r = getRecipe('breakfast-eggs-rye-skyr');
  const two = scaleRecipe(r, 2);
  assert.equal(two.ingredients.find(i => i.foodId === 'skyr').grams, 300);
  assert.equal(two.nutrition.proteinG, 76);
  assert.equal(scaleRecipe(r, 0.5).nutrition.kcal, 263);
  const edited = scaleRecipe(r, 1, { skyr: 200 });
  assert.equal(edited.ingredients.find(i => i.foodId === 'skyr').grams, 200);
  assert.equal(edited.portionsEdited, true);
  assert.equal(scaleRecipe(r, 1).portionsEdited, false);
});

test('unknown macros propagate as unknown, never zero', () => {
  const social = getRecipe('dinner-social-choice');
  assert.equal(scaleRecipe(social, 2).nutrition.proteinG, null);
  const sat = weekPlan()[5];
  assert.equal(sat.totals.unknown, 1);
  assert.equal(sat.totals.complete, false);
  assert.equal(sat.totals.proteinG, 126); // known meals only, flagged incomplete
  const custom = customJournalEntry({ date: '2026-11-28', name: 'Pizza night', proteinG: '' });
  assert.equal(custom.nutrition.proteinG, null);
  const p = proteinForDate([custom, journalEntryFromRecipe(getRecipe('snack-skyr-berries'), '2026-11-28')], '2026-11-28');
  assert.deepEqual(p, { known: 25, unknown: 1, entries: 2 });
});

test('week plan matches the seed example; swaps change totals', () => {
  const w = weekPlan();
  assert.equal(w[0].totals.proteinG, 165);
  assert.equal(w[1].totals.proteinG, 159);
  const swapped = weekPlan({ 0: { lunch: 'lunch-chicken-rice' } });
  assert.equal(swapped[0].meals.find(m => m.slot === 'lunch').swapped, true);
  assert.equal(swapped[0].totals.proteinG, 165 - 50 + 46);
});

test('shopping list aggregates by food id, keeps cooked chicken separate, scales by people', () => {
  const one = flat(shoppingList());
  assert.equal(one.chicken.grams, 740);          // raw: 160 + 150 + 130 + 150 + 150
  assert.equal(one.chicken_cooked.grams, 245);   // leftover cooked weight, not raw
  assert.match(one.chicken_cooked.note, /Estimate/);
  assert.equal(one.skyr.grams, 1390);
  assert.equal(one.potatoes.grams, 1050);
  assert.equal(flat(shoppingList({}, 2)).chicken.grams, 1480);
  // swapping Monday lunch tuna pasta -> chicken rice removes tuna and adds 150 g raw chicken
  const sw = flat(shoppingList({ 0: { lunch: 'lunch-chicken-rice' } }));
  assert.equal(sw.tuna, undefined); assert.equal(sw.chicken.grams, 890);
  assert.match(shoppingText(shoppingList()), /MEAT & FISH/);
});

test('training context: logged workout beats choice beats plan, no hard-coded weekday', () => {
  assert.deepEqual(dayContext({ history: [{ date: '2026-11-25', type: 'legs' }], choice: 'rest', planned: 'pull', date: '2026-11-25' }), { training: true, type: 'legs', source: 'logged' });
  assert.equal(dayContext({ history: [], choice: 'rest', planned: 'pull', date: '2026-11-25' }).training, false);
  assert.equal(dayContext({ history: [], choice: null, planned: null, date: '2026-11-25' }).training, false);
  assert.equal(dayContext({ history: [], choice: 'push', planned: null, date: '2026-11-25' }).type, 'push');
});

test('old backups without nutrition import with gym history, workouts, photos and measurements intact', () => {
  const old = { version: 1, profile: { goalSessions: 4 }, history: [{ id: 'h1', date: '2026-11-23', type: 'pull', source: 'recorded', exercises: [{ exerciseId: 'lat-pd', machineId: 'lat-new', sets: [{ weight: 60, reps: 10 }] }] }], measurements: [{ id: 'm1', date: '2026-11-20', weight: 94 }], photos: [{ id: 'p1', date: '2026-11-01', data: 'data:image/jpeg;base64,xx' }], changeLog: [], active: { id: 'w', exercises: [] } };
  const s = prepareImport(JSON.parse(JSON.stringify(old)));
  assert.deepEqual(s.history, old.history);
  assert.deepEqual(s.measurements, old.measurements);
  assert.deepEqual(s.photos, old.photos);
  assert.deepEqual(s.active, old.active);
  assert.equal(s.profile.goalSessions, 4);
  assert.deepEqual(s.nutrition.journal, []);
  assert.equal(s.nutrition.version, 1);
});

test('backups include nutrition logs and survive a round trip', () => {
  const st = freshState();
  st.nutrition.journal.push(customJournalEntry({ date: '2026-11-25', name: 'Test meal', proteinG: 30 }));
  st.nutrition.body.push({ id: 'b1', date: '2026-11-25', waist: 98, weight: null, bloating: 2 });
  const back = prepareImport(JSON.parse(JSON.stringify(backupPayload(st))));
  assert.equal(back.nutrition.journal[0].name, 'Test meal');
  assert.equal(back.nutrition.body[0].waist, 98);
  assert.equal(back.nutrition.body[0].weight, null);
  assert.ok(Array.isArray(migrateState({ version: 1, history: [], nutrition: { journal: 'broken' } }).nutrition.journal));
  assert.deepEqual(migrateNutrition(null).journal, []);
});

test('seed meals are never presented as eaten', () => {
  assert.deepEqual(freshState().nutrition.journal, []);
  assert.ok(NUTRITION.recipes.filter(r => r.ingredients.some(i => /milk|yogurt|skyr|cottage|whey/i.test(i.name))).every(r => r.ingredients.filter(i => /milk|yogurt|skyr|cottage|whey/i.test(i.name)).every(i => /lactose-free|tolerated/i.test(i.name))));
});

test('build what I ate: 3 eggs + toast + avocado estimate and feedback', () => {
  const m = mealFromItems([{ foodId: 'egg', qty: 3 }, { foodId: 'toast', qty: 2 }, { foodId: 'avocado', qty: 1 }]);
  assert.deepEqual(m.nutrition, { kcal: 520, proteinG: 29, carbsG: 39, fatG: 28 });
  const fb = mealFeedback(m, { slot: 'breakfast' });
  assert.equal(fb[0].tone, 'mid'); assert.match(fb[0].text, /skyr/);
  assert.ok(fb.some(x => /No veg/.test(x.text)));
  assert.equal(mealFeedback(mealFromItems([]), {}).length, 1);
  const e = builtJournalEntry({ date: '2026-11-25', slot: 'breakfast', items: [{ foodId: 'egg', qty: 3 }] });
  assert.equal(e.source, 'built'); assert.equal(e.nutrition.proteinG, 20); assert.equal(e.name, '3 eggs');
});

test('canteen plates: creamy/fried days get a gentle note, protein still counts', () => {
  const m = mealFromItems([{ foodId: 'c-protein', qty: 1.5 }, { foodId: 'c-cream', qty: 1 }, { foodId: 'c-fried', qty: 1 }, { foodId: 'veg', qty: 1 }]);
  assert.ok(m.nutrition.proteinG >= 30);
  const fb = mealFeedback(m, { slot: 'lunch' });
  assert.equal(fb[0].tone, 'good'); assert.ok(fb.some(x => /Heavy plate/.test(x.text)));
  assert.ok(!mealFeedback(mealFromItems([{ foodId: 'c-protein', qty: 1.5 }, { foodId: 'c-light', qty: 1 }]), { slot: 'lunch' }).some(x => /cream|Heavy/i.test(x.text)));
});

test('My meals default to the usual breakfasts and canteen lunch, and old data keeps its own', () => {
  assert.deepEqual(migrateNutrition({}).myMeals.map(m => m.id), DEFAULT_MY_MEALS.map(m => m.id));
  assert.deepEqual(migrateNutrition({ myMeals: [] }).myMeals, []);
  assert.ok(DEFAULT_MY_MEALS.some(m => m.id === 'my-canteen'));
});

test('supplements: defaults, streaks, week dots and safe migration', async () => {
  const { suppStreak, suppWeek, DEFAULT_SUPPLEMENTS, DAY_NAMES } = await import('../lib/nutrition.js');
  assert.deepEqual(DEFAULT_SUPPLEMENTS.map(s => s.id), ['creatine', 'omega3', 'vitaepro']);
  assert.equal(DAY_NAMES[0], 'Monday');
  const log = { '2026-11-23': ['creatine'], '2026-11-24': ['creatine', 'omega3'], '2026-11-25': ['omega3'] };
  assert.equal(suppStreak(log, 'creatine', '2026-11-25'), 2); // today not ticked yet: streak kept
  assert.equal(suppStreak(log, 'omega3', '2026-11-25'), 2);
  assert.equal(suppStreak(log, 'vitaepro', '2026-11-25'), 0);
  assert.deepEqual(suppWeek(log, 'creatine', '2026-11-23'), [true, true, false, false, false, false, false]);
  const m = migrateNutrition({ journal: [] });
  assert.equal(m.supplements.length, 3); assert.deepEqual(m.suppLog, {});
  assert.deepEqual(migrateNutrition({ supplements: [], suppLog: [] }).supplements, []);
  assert.deepEqual(migrateNutrition({ suppLog: [] }).suppLog, {});
});
