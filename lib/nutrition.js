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
  return { version: 1, weekOverrides: {}, shoppingChecked: {}, shoppingWeek: null, people: 1, journal: [], body: [], sessionChoice: {} };
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
