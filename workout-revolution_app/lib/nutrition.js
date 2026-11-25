// Food & Recovery: pure planning helpers (no DOM, no storage). All seed numbers are estimates.
// Rules: planned != eaten; unknown nutrition (null) is never counted as zero.
import { NUTRITION } from '../data/nutrition.js';

export const SLOTS = ['breakfast', 'lunch', 'snack', 'dinner'];
export const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack'];
export const MACROS = ['kcal', 'proteinG', 'carbsG', 'fatG'];
export const SERVING_STEPS = [0.5, 1, 2, 3, 4];
export const DAY_NAMES = NUTRITION.weeklyExample.map(d => d.day); // Monday … Sunday
export const COOKED_TO_RAW = 1.33; // rough estimate: cooked chicken weighs ~25% less than raw

export function nutritionDefaults() {
  return { version: 1, weekOverrides: {}, shoppingChecked: {}, shoppingWeek: null, people: 1, journal: [], body: [], sessionChoice: {}, myMeals: DEFAULT_MY_MEALS.map(m => JSON.parse(JSON.stringify(m))), supplements: DEFAULT_SUPPLEMENTS.map(x => ({ ...x })), suppLog: {} };
}
// Old backups (before Food existed) have no `nutrition`; merge defaults without touching anything else.
export function migrateNutrition(n) {
  const d = nutritionDefaults();
  if (!n || typeof n !== 'object') return d;
  return {
    ...d, ...n,
    weekOverrides: n.weekOverrides && typeof n.weekOverrides === 'object' ? n.weekOverrides : {},
    shoppingChecked: n.shoppingChecked && typeof n.shoppingChecked === 'object' ? n.shoppingChecked : {},
    journal: Array.isArray(n.journal) ? n.journal : [],
    body: Array.isArray(n.body) ? n.body : [],
    sessionChoice: n.sessionChoice && typeof n.sessionChoice === 'object' ? n.sessionChoice : {},
    myMeals: Array.isArray(n.myMeals) ? n.myMeals : DEFAULT_MY_MEALS.map(m => JSON.parse(JSON.stringify(m))),
    supplements: Array.isArray(n.supplements) ? n.supplements : DEFAULT_SUPPLEMENTS.map(x => ({ ...x })),
    suppLog: n.suppLog && typeof n.suppLog === 'object' && !Array.isArray(n.suppLog) ? n.suppLog : {},
    people: [1, 2, 3, 4].includes(Number(n.people)) ? Number(n.people) : 1
  };
}

export const recipes = () => NUTRITION.recipes;
export const getRecipe = (id) => NUTRITION.recipes.find(r => r.id === id) || null;
export function findRecipes({ category = 'all', query = '' } = {}) {
  const q = String(query).trim().toLowerCase();
  return NUTRITION.recipes.filter(r => (category === 'all' || r.category === category) &&
    (!q || r.name.toLowerCase().includes(q) || r.ingredients.some(i => i.name.toLowerCase().includes(q)) || (r.tags || []).some(t => t.includes(q))));
}

const scaleNum = (v, k) => (v == null ? null : Math.round(v * k));
// Scale a recipe for cooking. `portions` maps foodId -> grams per ONE serving (user edits).
// Nutrition scales with servings only; edited portions mark it as no longer matching (`portionsEdited`).
export function scaleRecipe(recipe, servings = 1, portions = {}) {
  if (!recipe) return null;
  const k = Number(servings) > 0 ? Number(servings) : 1;
  const edited = Object.keys(portions).some(id => recipe.ingredients.some(i => i.foodId === id && Number(portions[id]) !== i.grams));
  return {
    ...recipe, servingsScaled: k,
    ingredients: recipe.ingredients.map(i => ({ ...i, grams: Math.round((portions[i.foodId] != null ? Number(portions[i.foodId]) : i.grams) * k * 10) / 10 })),
    nutrition: Object.fromEntries(MACROS.map(m => [m, scaleNum(recipe.nutritionApprox?.[m], k)])),
    portionsEdited: edited
  };
}

// Sum nutrition of items [{nutrition}] keeping unknowns separate: never null -> 0.
export function sumNutrition(items) {
  const out = { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0, unknown: 0, count: 0 };
  for (const it of items) {
    out.count++;
    const n = it?.nutrition;
    if (!n || MACROS.some(m => n[m] == null)) { out.unknown++; if (!n) continue; }
    for (const m of MACROS) if (n[m] != null) out[m] += Number(n[m]);
  }
  out.complete = out.unknown === 0;
  return out;
}

// Week plan = seed example + user swaps. dayIndex 0 = Monday.
export function weekPlan(overrides = {}) {
  return NUTRITION.weeklyExample.map((d, i) => {
    const meals = SLOTS.map(slot => {
      const id = overrides?.[i]?.[slot] || d.meals[slot];
      const r = getRecipe(id);
      return { slot, recipeId: id, recipe: r, swapped: Boolean(overrides?.[i]?.[slot] && overrides[i][slot] !== d.meals[slot]), nutrition: r ? scaleRecipe(r, 1).nutrition : null };
    });
    return { index: i, day: d.day, exampleWorkout: d.exampleWorkout, dayNotes: d.dayNotes, extras: d.addIfHungryOrLongWorkout, meals, totals: sumNutrition(meals) };
  });
}
export const swapOptions = (slot) => NUTRITION.recipes.filter(r => r.category === (slot === 'snack' ? 'snack' : slot));

const AISLES = [
  ['meat', 'Meat & fish', ['chicken', 'turkeymince', 'beef', 'salmon', 'cod']],
  ['leftovers', 'Leftovers to cook ahead (cooked weight)', ['chicken_cooked']],
  ['eggs', 'Eggs', ['egg']],
  ['dairy', 'Lactose-free dairy', ['skyr', 'milk', 'yogurt', 'cottage']],
  ['bread', 'Bread & grains', ['rye', 'oats', 'pasta', 'rice', 'noodles', 'tortilla']],
  ['veg', 'Vegetables', ['tomato', 'cucumber', 'spinach', 'veg', 'broccoli', 'greens', 'lettuce', 'peas', 'beansgreen', 'pepper', 'onion', 'potatoes']],
  ['fruit', 'Fruit', ['banana', 'avocado']],
  ['frozen', 'Frozen', ['berries']],
  ['canned', 'Canned & jars', ['tuna', 'passata', 'chickpeas']],
  ['pantry', 'Oils & pantry', ['oil', 'nuts', 'peanutbutter']],
  ['supplements', 'Optional supplements', ['whey']]
];
export const aisleOf = (foodId) => (AISLES.find(a => a[2].includes(foodId)) || ['other', 'Other', []]);

// Aggregate ingredients by canonical foodId for the planned week (with swaps), for N people.
export function shoppingList(overrides = {}, people = 1) {
  const items = new Map();
  for (const d of weekPlan(overrides)) for (const m of d.meals) for (const ing of (m.recipe?.ingredients || [])) {
    const cur = items.get(ing.foodId) || { foodId: ing.foodId, name: ing.name, grams: 0, uses: 0 };
    cur.grams += ing.grams * people; cur.uses++; items.set(ing.foodId, cur);
  }
  const groups = AISLES.map(([key, label, ids]) => ({ key, label, items: ids.filter(id => items.has(id)).map(id => decorate(items.get(id))) })).filter(g => g.items.length);
  const other = [...items.values()].filter(i => aisleOf(i.foodId)[0] === 'other');
  if (other.length) groups.push({ key: 'other', label: 'Other', items: other.map(decorate) });
  return groups;
}
function decorate(i) {
  const g = Math.round(i.grams);
  let amount = `${g} g`, note = '';
  if (i.foodId === 'milk') amount = `≈ ${g} ml`;
  if (i.foodId === 'egg') amount = `≈ ${Math.round(g / 55)} eggs (${g} g)`;
  if (i.foodId === 'chicken_cooked') note = `Estimate: cook ≈ ${Math.round(g * COOKED_TO_RAW / 10) * 10} g raw chicken extra if you have no leftovers`;
  return { ...i, grams: g, amount, note };
}
export function shoppingText(groups, title = 'Shopping list') {
  return [title, ...groups.flatMap(g => ['', g.label.toUpperCase(), ...g.items.map(i => `- ${i.name}: ${i.amount}${i.note ? ` (${i.note})` : ''}`)])].join('\n');
}

// Journal (actually eaten). Entries are user-created only; nutrition null stays null.
export function journalEntryFromRecipe(recipe, date, servings = 1, extra = {}) {
  const s = scaleRecipe(recipe, servings);
  return { id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date, recipeId: recipe.id, name: recipe.name, category: recipe.category, servings: Number(servings), nutrition: s.nutrition, source: 'recipe', ...extra };
}
export function customJournalEntry({ date, name, proteinG = null, kcal = null, notes = '' }) {
  const num = v => (v === '' || v == null || !Number.isFinite(Number(v)) ? null : Number(v));
  return { id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date, recipeId: null, name: String(name).trim(), category: 'custom', servings: 1, nutrition: { kcal: num(kcal), proteinG: num(proteinG), carbsG: null, fatG: null }, notes: String(notes || '').trim(), source: 'custom' };
}
export const journalForDate = (journal = [], date) => journal.filter(e => e.date === date);
// Protein eaten on a date: known total + how many entries had unknown protein.
export function proteinForDate(journal, date) {
  const e = journalForDate(journal, date);
  return { known: e.reduce((n, x) => n + (x.nutrition?.proteinG ?? 0), 0), unknown: e.filter(x => x.nutrition?.proteinG == null).length, entries: e.length };
}

// Training context for a date: logged workout > user's choice > weekly plan suggestion.
export function dayContext({ history = [], choice = null, planned = null, date }) {
  const logged = history.filter(s => s.date === date).map(s => s.type);
  if (logged.length) return { training: true, type: logged[0], source: 'logged' };
  if (choice) return { training: choice !== 'rest', type: choice === 'rest' ? null : choice, source: 'chosen' };
  if (planned) return { training: true, type: planned, source: 'plan' };
  return { training: false, type: null, source: 'plan' };
}

// ---------- Everyday foods: build what you actually ate ----------
// Approximate generic values per unit (not brand-specific). Used for quick estimates, never shown as exact.
export const FOODS = [
  // Canteen / eating out: you can't weigh it, so portions are by hand size and the sauce is what changes day to day.
  { id: 'c-protein', name: 'Canteen meat / fish / chicken', unit: 'palm', step: 0.5, def: 1.5, group: 'canteen', p: 22, kcal: 170, c: 0, f: 8 },
  { id: 'c-veggie', name: 'Canteen veggie main (beans, lentils, tofu)', unit: 'portion', step: 0.5, def: 1, group: 'canteen', p: 14, kcal: 250, c: 28, f: 8 },
  { id: 'c-cream', name: 'Creamy sauce / gratin', unit: 'ladle', step: 0.5, def: 1, group: 'canteen', p: 1, kcal: 150, c: 4, f: 14, dairy: 'regular', rich: true },
  { id: 'c-light', name: 'Light sauce (tomato, curry, gravy)', unit: 'ladle', step: 0.5, def: 1, group: 'canteen', p: 1, kcal: 60, c: 6, f: 3 },
  { id: 'c-fried', name: 'Breaded / fried', unit: 'portion', step: 1, def: 1, group: 'canteen', p: 2, kcal: 160, c: 12, f: 11, rich: true },
  { id: 'c-dessert', name: 'Canteen dessert / cake', unit: 'piece', step: 1, def: 1, group: 'canteen', p: 3, kcal: 280, c: 38, f: 13 },
  { id: 'egg', name: 'Egg', unit: 'egg', step: 1, def: 3, group: 'protein', p: 6.5, kcal: 75, c: 0.4, f: 5 },
  { id: 'chicken', name: 'Chicken breast, cooked', unit: '100 g', step: 0.5, def: 1.5, group: 'protein', p: 31, kcal: 165, c: 0, f: 3.6 },
  { id: 'salmon', name: 'Salmon, cooked', unit: '100 g', step: 0.5, def: 1.5, group: 'protein', p: 25, kcal: 210, c: 0, f: 13 },
  { id: 'whitefish', name: 'Cod / white fish, cooked', unit: '100 g', step: 0.5, def: 1.5, group: 'protein', p: 23, kcal: 105, c: 0, f: 1 },
  { id: 'tuna', name: 'Tuna, can (drained)', unit: 'can', step: 0.5, def: 1, group: 'protein', p: 30, kcal: 130, c: 0, f: 1 },
  { id: 'mince', name: 'Lean mince, cooked', unit: '100 g', step: 0.5, def: 1.5, group: 'protein', p: 26, kcal: 215, c: 0, f: 13 },
  { id: 'skyr', name: 'Skyr, lactose-free', unit: '150 g', step: 0.5, def: 1, group: 'protein', p: 16, kcal: 95, c: 6, f: 0.3, dairy: 'lf' },
  { id: 'cottage', name: 'Cottage cheese, lactose-free', unit: '200 g', step: 0.5, def: 1, group: 'protein', p: 22, kcal: 180, c: 6, f: 8, dairy: 'lf' },
  { id: 'shake', name: 'Protein shake (1 scoop, lactose-free)', unit: 'scoop', step: 1, def: 1, group: 'protein', p: 25, kcal: 110, c: 2, f: 1, dairy: 'lf' },
  { id: 'cheese', name: 'Hard cheese slice', unit: 'slice', step: 1, def: 2, group: 'extra', p: 5, kcal: 70, c: 0, f: 5.5 },
  { id: 'toast', name: 'Wholegrain / rye toast', unit: 'slice', step: 1, def: 2, group: 'carb', p: 4, kcal: 90, c: 16, f: 1.2 },
  { id: 'rice', name: 'Rice, cooked', unit: 'fist (150 g)', step: 0.5, def: 1, group: 'carb', p: 4, kcal: 195, c: 42, f: 0.5 },
  { id: 'pasta', name: 'Pasta, cooked', unit: 'fist (150 g)', step: 0.5, def: 1, group: 'carb', p: 8, kcal: 235, c: 46, f: 1.5 },
  { id: 'potato', name: 'Potatoes', unit: 'fist (200 g)', step: 0.5, def: 1, group: 'carb', p: 4, kcal: 155, c: 34, f: 0.2 },
  { id: 'oats', name: 'Oats', unit: '50 g', step: 0.5, def: 1, group: 'carb', p: 6.5, kcal: 190, c: 30, f: 3.5 },
  { id: 'avocado', name: 'Avocado', unit: '½ avocado', step: 1, def: 1, group: 'extra', p: 1.4, kcal: 115, c: 6, f: 10.5 },
  { id: 'veg', name: 'Vegetables / salad', unit: 'fist', step: 1, def: 1, group: 'veg', p: 2, kcal: 30, c: 5, f: 0.3, veg: true },
  { id: 'tomato', name: 'Tomato / cucumber', unit: 'handful', step: 1, def: 1, group: 'veg', p: 1, kcal: 20, c: 4, f: 0.2, veg: true },
  { id: 'fruit', name: 'Fruit (banana, apple…)', unit: 'piece', step: 1, def: 1, group: 'veg', p: 1, kcal: 95, c: 24, f: 0.3, veg: true },
  { id: 'berries', name: 'Berries', unit: 'handful', step: 1, def: 1, group: 'veg', p: 1, kcal: 45, c: 10, f: 0.3, veg: true },
  { id: 'lfmilk', name: 'Milk, lactose-free', unit: 'glass (250 ml)', step: 1, def: 1, group: 'extra', p: 8.5, kcal: 115, c: 12, f: 4, dairy: 'lf' },
  { id: 'dairy', name: 'Regular milk / yogurt', unit: 'glass / pot', step: 1, def: 1, group: 'extra', p: 8, kcal: 120, c: 12, f: 4, dairy: 'regular' },
  { id: 'nuts', name: 'Nuts', unit: 'small handful (30 g)', step: 1, def: 1, group: 'extra', p: 6, kcal: 180, c: 5, f: 15 },
  { id: 'oil', name: 'Olive oil / butter', unit: 'tbsp', step: 1, def: 1, group: 'extra', p: 0, kcal: 110, c: 0, f: 12.5 },
  { id: 'chocolate', name: 'Dark chocolate', unit: '25 g', step: 1, def: 1, group: 'extra', p: 2, kcal: 150, c: 11, f: 10.5 }
];
export const FOOD_GROUPS = [['canteen', 'Canteen / eating out'], ['protein', 'Protein'], ['carb', 'Carbs'], ['veg', 'Veg & fruit'], ['extra', 'Extras']];
export const getFood = (id) => FOODS.find(f => f.id === id) || null;
const fmtQty = (f, q) => f.unit === '½ avocado' ? (q === 1 ? '½ avocado' : `${q / 2} avocados`) : f.unit === 'egg' ? `${q} egg${q === 1 ? '' : 's'}` : f.unit === 'slice' ? `${q} slice${q === 1 ? '' : 's'} ${f.id === 'toast' ? 'toast' : 'cheese'}` : `${q}× ${f.unit} ${f.name.toLowerCase()}`;
// items: [{foodId, qty}] -> estimated meal
export function mealFromItems(items = []) {
  const rows = items.map(i => ({ ...i, food: getFood(i.foodId), qty: Number(i.qty) })).filter(r => r.food && r.qty > 0);
  const sum = (k) => Math.round(rows.reduce((n, r) => n + r.food[k] * r.qty, 0));
  return {
    rows, name: rows.map(r => fmtQty(r.food, r.qty)).join(', '),
    nutrition: rows.length ? { kcal: sum('kcal'), proteinG: sum('p'), carbsG: sum('c'), fatG: sum('f') } : { kcal: null, proteinG: null, carbsG: null, fatG: null },
    hasVeg: rows.some(r => r.food.veg), hasCarb: rows.some(r => r.food.group === 'carb' || r.food.id === 'fruit'), hasProtein: rows.some(r => r.food.group === 'protein' || r.foodId === 'c-protein' || r.foodId === 'c-veggie'),
    rich: rows.filter(r => r.food.rich).reduce((n, r) => n + r.qty, 0),
    regularDairy: rows.some(r => r.food.dairy === 'regular')
  };
}
// Calm, plan-based feedback. Main meals aim ~30–45 g protein; snacks ~15–25 g. Never a verdict on calories.
export function mealFeedback(meal, { slot = 'breakfast', training = false } = {}) {
  const p = meal.nutrition.proteinG, out = [];
  if (p == null) return [{ tone: 'info', text: 'Add what was on your plate to see feedback.' }];
  const snack = slot === 'snack', low = snack ? 12 : 20, ok = snack ? 15 : 30;
  const addOn = slot === 'breakfast' || snack ? '150 g lactose-free skyr (+16 g) or 1–2 more eggs (+6–13 g)' : 'a palm of chicken or fish (+25–30 g)';
  if (p < low) out.push({ tone: 'warn', text: `Light on protein (≈ ${p} g). Easy add: ${addOn}.` });
  else if (p < ok) out.push({ tone: 'mid', text: `Decent protein (≈ ${p} g). ${addOn[0].toUpperCase() + addOn.slice(1)} would get you to ${snack ? '15–25' : '30–45'} g.` });
  else out.push({ tone: 'good', text: `Good protein (≈ ${p} g).` });
  if (!snack) out.push(meal.hasVeg ? { tone: 'good', text: 'Has veg or fruit ✓' } : { tone: 'mid', text: 'No veg or fruit: a tomato, some cucumber or a piece of fruit rounds it out.' });
  if (training && !snack && !meal.hasCarb) out.push({ tone: 'mid', text: 'Training day: add a carb (toast, rice, potatoes or fruit) for energy.' });
  if (meal.rich >= 2) out.push({ tone: 'mid', text: 'Heavy plate (cream and/or fried). No problem now and then; on those days have salad as the side and keep dinner simple.' });
  else if (meal.rich) out.push({ tone: 'info', text: 'Creamy or fried today: fine. If it is offered, half a ladle of sauce plus salad keeps it lighter; the protein still counts.' });
  if (meal.regularDairy) out.push({ tone: 'info', text: 'Contains regular dairy: fine if it sits well, otherwise choose lactose-free.' });
  return out;
}
export const DEFAULT_MY_MEALS = [
  { id: 'my-eggs-toast', name: '3 eggs + toast', slot: 'breakfast', items: [{ foodId: 'egg', qty: 3 }, { foodId: 'toast', qty: 2 }] },
  { id: 'my-eggs-toast-avo', name: '3 eggs + toast + avocado', slot: 'breakfast', items: [{ foodId: 'egg', qty: 3 }, { foodId: 'toast', qty: 2 }, { foodId: 'avocado', qty: 1 }] },
  { id: 'my-canteen', name: 'Canteen lunch', slot: 'lunch', items: [{ foodId: 'c-protein', qty: 1.5 }, { foodId: 'potato', qty: 1 }, { foodId: 'veg', qty: 1 }] }
];
// ---------- Daily supplements (a checklist, not food) ----------
// Generic, label-first guidance. Doses follow the product label unless noted.
export const DEFAULT_SUPPLEMENTS = [
  { id: 'creatine', name: 'Creatine', dose: '3–5 g', why: 'Every day, rest days too. Timing does not matter; consistency does. Expect ~1 kg extra water weight on the scale in the first weeks: that is muscle water, not fat.' },
  { id: 'omega3', name: 'Omega-3', dose: 'as on label', why: 'Take with a meal that has some fat (fewer fishy burps, better absorbed). On days with salmon or other oily fish it matters less.' },
  { id: 'vitaepro', name: 'VitaePro', dose: 'as on label', why: 'Take with a meal, as the label says.' }
];
export function suppStreak(log = {}, id, date) {
  let n = 0, d = new Date(`${date}T12:00:00Z`);
  if (!(log[date] || []).includes(id)) d.setUTCDate(d.getUTCDate() - 1); // today not ticked yet doesn't break the streak
  for (;;) { const k = d.toISOString().slice(0, 10); if (!(log[k] || []).includes(id)) return n; n++; d.setUTCDate(d.getUTCDate() - 1); }
}
export function suppWeek(log = {}, id, weekStartDate) {
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(`${weekStartDate}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + i); return (log[d.toISOString().slice(0, 10)] || []).includes(id); });
}
export function builtJournalEntry({ date, slot, items, name = '' }) {
  const m = mealFromItems(items);
  return { id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date, recipeId: null, name: String(name || '').trim() || m.name, category: slot, servings: 1, items: m.rows.map(r => ({ foodId: r.foodId, qty: r.qty })), nutrition: m.nutrition, source: 'built' };
}
