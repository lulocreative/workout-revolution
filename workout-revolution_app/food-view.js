// Food & Recovery screen. Rendering + events only; logic lives in lib/nutrition.js.
// Planned meals are suggestions. Only entries the user logs in the journal count as eaten.
import { NUTRITION } from './data/nutrition.js';
import { SLOTS, CATEGORIES, SERVING_STEPS, DAY_NAMES, getRecipe, findRecipes, scaleRecipe, weekPlan, swapOptions, shoppingList, shoppingText,
  journalEntryFromRecipe, customJournalEntry, journalForDate, proteinForDate, dayContext, sumNutrition } from './lib/nutrition.js';

export function createFood(ctx) {
  const { esc, ico } = ctx;
  const ui = { tab: 'today', cat: 'all', query: '', sheet: null };
  const N = () => ctx.state().nutrition;
  const save = () => ctx.persist();
  const today = () => ctx.today();
  const dayIndex = (date) => (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
  const label = (t) => t ? ctx.workoutLabel(t) : 'Rest';
  const g = (v) => (v == null ? '?' : Math.round(v));
  const SLOT_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' };
  const est = '<span class="est">Estimate</span>';
  const proteinText = (n) => n?.proteinG == null ? 'protein unknown' : `≈ ${g(n.proteinG)} g protein`;
  const kcalText = (n) => n?.kcal == null ? 'kcal unknown' : `≈ ${g(n.kcal)} kcal`;
  const totalsText = (t) => `≈ ${g(t.proteinG)} g protein · ≈ ${g(t.kcal)} kcal${t.unknown ? ` <b class="unk">+ ${t.unknown} meal${t.unknown > 1 ? 's' : ''} unknown</b>` : ''}`;

  function recipeBody(r, servings = 1, portions = {}) {
    const s = scaleRecipe(r, servings, portions);
    const editable = Boolean(ui.sheet?.kind === 'recipe');
    return `<div class="food-recipe">
      <ul class="ing">${s.ingredients.map(i => `<li><span>${esc(i.name)}</span>${editable ? `<label class="ing-edit"><input type="number" inputmode="decimal" min="0" step="1" data-food="portion" data-id="${esc(i.foodId)}" value="${portions[i.foodId] ?? r.ingredients.find(x => x.foodId === i.foodId).grams}" aria-label="${esc(i.name)} grams per serving"/> g</label>` : ''}<b>${servings === 1 && !portions[i.foodId] ? esc(i.display) : `${i.grams} g`}</b></li>`).join('') || '<li class="muted">No fixed ingredients: you decide.</li>'}</ul>
      <h4>Method</h4><ol class="steps">${r.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
      ${r.notes?.length ? `<p class="small muted">${r.notes.map(esc).join(' ')}</p>` : ''}
      ${r.swaps?.length ? `<p class="small"><b>Swap:</b> ${r.swaps.map(esc).join(' ')}</p>` : ''}
      ${r.batchPrep ? `<p class="small"><b>Batch prep:</b> ${esc(r.batchPrep)}</p>` : ''}
    </div>`;
  }

  // ---------- Today ----------
  function today_() {
    const date = today(), n = N(), idx = dayIndex(date);
    const plan = weekPlan(n.weekOverrides)[idx];
    const planned = ctx.plannedToday();
    const c = dayContext({ history: ctx.state().history, choice: n.sessionChoice[date] || null, planned: planned.when === 'today' ? planned.type : null, date });
    const eaten = journalForDate(n.journal, date);
    const p = proteinForDate(n.journal, date);
    const pct = Math.min(100, Math.round(p.known / 160 * 100));
    const T = NUTRITION.trainingDayHints, R = NUTRITION.restDayHints;
    const sourceText = c.source === 'logged' ? 'from your logged workout' : c.source === 'chosen' ? 'you chose this' : c.training ? 'from your weekly plan, change it if needed' : 'no workout planned today';
    return `<section class="card food-ctx"><div class="eyebrow">TODAY · ${esc(DAY_NAMES[idx].toUpperCase())}</div>
      <h3 style="margin-top:8px">${c.training ? `${esc(label(c.type))} day` : 'Rest day'}</h3><p class="small muted" style="margin-top:4px">${sourceText}</p>
      ${c.source !== 'logged' ? `<div class="chip-row" role="group" aria-label="Training today?">${['pull', 'push', 'legs', 'focus', 'rest'].map(t => `<button class="pick ${(c.type || 'rest') === t && (c.training || t === 'rest') ? 'on' : ''}" data-action="food-session" data-type="${t}">${esc(t === 'rest' ? 'Rest' : label(t))}</button>`).join('')}</div>` : ''}
      <div class="tips">${c.training ? `<p><b>Before:</b> ${esc(T.preWorkout)}</p><p><b>After:</b> ${esc(T.postWorkout)}</p><p><b>Extra carbs if hungry or a long session:</b> ${T.carbAdditions.map(esc).join(' · ')}</p>` : `<p><b>Protein:</b> ${esc(R.protein)}</p><p><b>Carbs:</b> ${esc(R.carbs)}</p>`}</div></section>
    <section class="card food-protein"><div class="card-header"><div><div class="eyebrow">EATEN TODAY · LOGGED BY YOU</div><h3 style="margin-top:8px">${p.entries ? `${g(p.known)} g protein` : 'Nothing logged yet'}${p.unknown ? ` <span class="unk">+ ${p.unknown} unknown</span>` : ''}</h3></div></div>
      <div class="pbar"><i style="width:${pct}%"></i><span class="band" title="140–160 g"></span></div>
      <p class="small muted">Most days ~140–160 g works well; 130 g on an imperfect day is fine. Meals you log count here, planned ones don't.</p></section>
    <div class="section-row"><h2 class="section-title">Planned meals</h2><span class="section-helper">PLAN, NOT EATEN</span></div>
    ${plan.dayNotes ? `<div class="notice" style="margin-bottom:12px">${esc(plan.dayNotes)}</div>` : ''}
    <div class="meal-list">${plan.meals.map(m => {
      const done = eaten.find(e => e.planned?.slot === m.slot && e.planned?.date === date);
      return `<article class="meal ${done ? 'eaten' : ''}"><div class="meal-top"><span class="slot">${SLOT_LABEL[m.slot]}</span><span class="chip ${done ? 'green' : ''}">${done ? 'Eaten ✓' : 'Planned'}</span></div>
        <h4>${esc(m.recipe?.name || m.recipeId)}</h4><p class="small muted">${proteinText(m.nutrition)} · ${kcalText(m.nutrition)} · ${m.recipe?.timeMinutes || 0} min ${est}</p>
        <details><summary>Recipe & portions</summary>${m.recipe ? recipeBody(m.recipe) : ''}</details>
        <div class="meal-actions"><button class="btn ${done ? 'btn-subtle' : 'btn-dark'} btn-sm" data-action="food-eat" data-slot="${m.slot}">${done ? 'Undo eaten' : `${ico('check', 16)} I ate this`}</button><button class="btn btn-subtle btn-sm" data-action="food-recipe" data-id="${esc(m.recipeId)}">Scale / cook</button></div></article>`;
    }).join('')}</div>
    <p class="small muted" style="margin-top:10px">Still hungry? ${plan.extras.map(esc).join(' · ')}</p>
    <div class="food-quick"><button class="btn btn-subtle btn-block" data-action="food-open-custom">${ico('plus')} Ate something else</button><button class="btn btn-subtle btn-block" data-action="food-choc">Dark chocolate ~25 g</button></div>`;
  }

  // ---------- Week ----------
  function week_() {
    const n = N(), plan = weekPlan(n.weekOverrides), tIdx = dayIndex(today());
    return `<p class="small muted" style="margin-bottom:12px">A rotating example, not a fixed calendar. Swap any meal; the shopping list and totals update. All numbers are estimates.</p>
    <div class="week-grid">${plan.map(d => `<section class="card week-day ${d.index === tIdx ? 'is-today' : ''}"><div class="card-header"><div><div class="eyebrow">${esc(d.day.toUpperCase())}${d.index === tIdx ? ' · TODAY' : ''}</div><p class="small" style="margin-top:6px">${totalsText(d.totals)} ${est}</p></div></div>
      ${d.meals.map(m => `<div class="week-meal"><div><span class="slot">${SLOT_LABEL[m.slot]}</span><b>${esc(m.recipe?.name || m.recipeId)}</b>${m.swapped ? ' <span class="chip lime">Swapped</span>' : ''}</div><button class="btn btn-subtle btn-sm" data-action="food-swap" data-day="${d.index}" data-slot="${m.slot}">Swap</button></div>`).join('')}
      ${d.dayNotes ? `<p class="small muted" style="margin-top:8px">${esc(d.dayNotes)}</p>` : ''}</section>`).join('')}</div>`;
  }

  // ---------- Recipes ----------
  const recipeList = () => findRecipes({ category: ui.cat, query: ui.query }).map(r => `<button class="recipe-card" data-action="food-recipe" data-id="${esc(r.id)}"><span class="slot">${esc(r.category)}</span><b>${esc(r.name)}</b><span class="small muted">${proteinText(r.nutritionApprox)} · ${r.timeMinutes} min</span><span class="tags">${(r.tags || []).slice(0, 3).map(t => `<i>${esc(t)}</i>`).join('')}</span></button>`).join('') || '<div class="empty">No recipes match.</div>';
  function recipes_() {
    return `<div class="chip-row">${['all', ...CATEGORIES].map(c => `<button class="pick ${ui.cat === c ? 'on' : ''}" data-action="food-cat" data-cat="${c}">${c === 'all' ? 'All' : c[0].toUpperCase() + c.slice(1)}</button>`).join('')}</div>
    <div class="form-field" style="margin:12px 0"><input type="search" data-food="query" value="${esc(ui.query)}" placeholder="Search recipes or ingredients" aria-label="Search recipes" autocomplete="off"/></div>
    <div class="recipe-grid" id="food-recipe-list">${recipeList()}</div>`;
  }

  // ---------- Shopping ----------
  function shopping_() {
    const n = N(), groups = shoppingList(n.weekOverrides, n.people);
    if (n.shoppingWeek !== ctx.weekStart()) { n.shoppingWeek = ctx.weekStart(); n.shoppingChecked = {}; save(); }
    return `<div class="card-header" style="align-items:center;margin-bottom:12px"><div><p class="small muted">From this week's plan, including your swaps. Planning amounts: buy sensible pack sizes.</p></div></div>
    <div class="chip-row" role="group" aria-label="People">${[1, 2, 3, 4].map(p => `<button class="pick ${n.people === p ? 'on' : ''}" data-action="food-people" data-n="${p}">${p} ${p === 1 ? 'person' : 'people'}</button>`).join('')}</div>
    <div class="shop">${groups.map(gr => `<section class="card shop-group"><div class="eyebrow">${esc(gr.label.toUpperCase())}</div>${gr.items.map(i => `<label class="shop-item ${n.shoppingChecked[i.foodId] ? 'got' : ''}"><input type="checkbox" data-food="check" data-id="${esc(i.foodId)}" ${n.shoppingChecked[i.foodId] ? 'checked' : ''}/><span><b>${esc(i.name)}</b>${i.note ? `<small>${esc(i.note)}</small>` : ''}</span><em>${esc(i.amount)}</em></label>`).join('')}</section>`).join('')}</div>
    <p class="small muted" style="margin:10px 0">Flexible social dinners have no ingredients here. Raw weights for meat and fish; dry weights for rice, pasta and oats.</p>
    <button class="btn btn-dark btn-block" data-action="food-copy">${ico('check')} Copy shopping list</button>`;
  }

  // ---------- Journal ----------
  function journal_() {
    const n = N();
    const dates = [...new Set(n.journal.map(e => e.date))].sort().reverse().slice(0, 30);
    return `<div class="notice" style="margin-bottom:12px">Only what you log here counts as eaten. Planned meals are never added automatically.</div>
    <div class="food-quick"><button class="btn btn-dark btn-block" data-action="food-open-log">${ico('plus')} Log a recipe</button><button class="btn btn-subtle btn-block" data-action="food-open-custom">${ico('plus')} Log a free meal</button></div>
    ${dates.length ? dates.map(d => { const p = proteinForDate(n.journal, d); const es = journalForDate(n.journal, d); return `<section class="card journal-day"><div class="card-header"><div><div class="eyebrow">${esc(ctx.fmtDate(d))}</div><p class="small" style="margin-top:6px"><b>${g(p.known)} g protein logged</b>${p.unknown ? ` <span class="unk">+ ${p.unknown} unknown</span>` : ''}</p></div></div>
      ${es.map(e => `<div class="journal-entry"><div><b>${esc(e.name)}</b><span class="small muted">${e.servings !== 1 ? `${e.servings} servings · ` : ''}${proteinText(e.nutrition)}${e.source === 'recipe' ? ' (estimate)' : ''}${e.notes ? ` · ${esc(e.notes)}` : ''}</span></div><button class="icon-btn" data-action="food-del-entry" data-id="${esc(e.id)}" aria-label="Delete ${esc(e.name)}">${ico('x', 16)}</button></div>`).join('')}</section>`; }).join('') : '<div class="empty">No meals logged yet.</div>'}`;
  }

  // ---------- Body & bloating ----------
  function body_() {
    const n = N(), list = [...n.body].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 21), E = NUTRITION.bloatingExperiment;
    return `<section class="card"><div class="eyebrow">MORNING CHECK-IN · ALL OPTIONAL</div><h3 style="margin-top:8px">How's your body today?</h3>
      <form id="food-body-form" class="stack" style="gap:12px;margin-top:14px">
        <div class="modal-grid" style="margin-top:0"><div class="form-field"><label for="fb-date">Date</label><input id="fb-date" name="date" type="date" value="${today()}" required/></div><div class="form-field"><label for="fb-weight">Morning weight · kg</label><input id="fb-weight" name="weight" type="number" step=".1" min="30" max="250" inputmode="decimal" placeholder="Optional"/></div><div class="form-field"><label for="fb-waist">Waist at belly button · cm</label><input id="fb-waist" name="waist" type="number" step=".5" min="40" max="200" inputmode="decimal" placeholder="Optional"/></div><div class="form-field"><label for="fb-bloat">Bloating · 0 none to 10 severe</label><input id="fb-bloat" name="bloating" type="number" min="0" max="10" step="1" inputmode="numeric" placeholder="Optional"/></div></div>
        <div class="form-field"><label for="fb-trig">Possible triggers</label><input id="fb-trig" name="triggers" placeholder="e.g. big dinner, onion, fizzy drink"/></div>
        <div class="form-field"><label for="fb-notes">Notes</label><input id="fb-notes" name="notes" placeholder="Optional"/></div>
        <button class="btn btn-dark btn-block" type="submit">Save check-in</button></form>
      <p class="small muted" style="margin-top:12px">${esc(E.instructions)}</p></section>
    ${list.length ? `<section class="card" style="margin-top:14px"><div class="eyebrow">YOUR CHECK-INS</div>${list.map(b => `<div class="journal-entry"><div><b>${esc(ctx.fmtDate(b.date))}</b><span class="small muted">${[b.weight != null ? `${b.weight} kg` : null, b.waist != null ? `waist ${b.waist} cm` : null, b.bloating != null ? `bloating ${b.bloating}/10` : null, b.triggers ? esc(b.triggers) : null, b.notes ? esc(b.notes) : null].filter(Boolean).join(' · ') || 'No values'}</span></div><button class="icon-btn" data-action="food-del-body" data-id="${esc(b.id)}" aria-label="Delete check-in">${ico('x', 16)}</button></div>`).join('')}</section>` : ''}
    <p class="small muted" style="margin-top:12px">Look for patterns over 2–3 weeks, not single days. This is not a diagnosis; persistent painful bloating or other worrying symptoms are worth discussing with a doctor.</p>`;
  }

  function render() {
    const tabs = [['today', 'Today'], ['week', 'Week'], ['recipes', 'Recipes'], ['shopping', 'Shopping'], ['journal', 'Journal'], ['body', 'Body']];
    const body = { today: today_, week: week_, recipes: recipes_, shopping: shopping_, journal: journal_, body: body_ }[ui.tab]();
    return `${ctx.header('Food.', 'Recipes, a flexible week plan and what you actually ate. Every number is an estimate.')}
      <nav class="food-tabs" aria-label="Food sections">${tabs.map(([k, l]) => `<button class="${ui.tab === k ? 'on' : ''}" data-action="food-tab" data-tab="${k}" ${ui.tab === k ? 'aria-current="page"' : ''}>${l}</button>`).join('')}</nav>
      <div class="food-body">${body}</div>`;
  }

  // ---------- Sheets ----------
  function sheet() {
    const s = ui.sheet; if (!s) return '';
    const wrap = (eyebrow, title, inner) => `<div class="modal-backdrop sheet" data-close-backdrop="1"><div class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="modal-heading"><div class="modal-title"><div><div class="eyebrow">${eyebrow}</div><h2 id="modal-heading">${title}</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close dialog">${ico('x')}</button></div>${inner}</div></div>`;
    if (s.kind === 'recipe') {
      const r = getRecipe(s.id); if (!r) return '';
      const sc = scaleRecipe(r, s.servings, s.portions);
      return wrap(`${esc(r.category.toUpperCase())} · ${r.timeMinutes} MIN`, esc(r.name), `
        <div class="nut-row">${[['Protein', sc.nutrition.proteinG, 'g'], ['Energy', sc.nutrition.kcal, 'kcal'], ['Carbs', sc.nutrition.carbsG, 'g'], ['Fat', sc.nutrition.fatG, 'g']].map(([l, v, u]) => `<div><span>${l}</span><b>${v == null ? 'Unknown' : `≈ ${v} ${u}`}</b></div>`).join('')}</div>
        <p class="small muted" style="margin-top:6px">${est} ${esc(r.nutritionApprox.label)}${sc.portionsEdited ? '. You edited portions: these totals still follow the original recipe scaled by servings.' : ''}</p>
        <div class="chip-row" role="group" aria-label="Servings" style="margin-top:14px">${SERVING_STEPS.map(v => `<button class="pick ${s.servings === v ? 'on' : ''}" data-action="food-servings" data-n="${v}">${v === 0.5 ? '½' : v}×</button>`).join('')}</div>
        <p class="small muted" style="margin-top:8px">Portions per serving are editable; amounts on the right are for ${s.servings} serving${s.servings === 1 ? '' : 's'}.</p>
        ${recipeBody(r, s.servings, s.portions)}
        <form id="food-log-recipe-form" class="log-row"><div class="form-field"><label for="flr-date">Ate it on</label><input id="flr-date" name="date" type="date" value="${today()}" required/></div><button class="btn btn-dark" type="submit">${ico('check')} Log ${s.servings === 1 ? '' : `${s.servings}× `}as eaten</button></form>`);
    }
    if (s.kind === 'swap') {
      const opts = swapOptions(s.slot), cur = weekPlan(N().weekOverrides)[s.day].meals.find(m => m.slot === s.slot);
      return wrap(`${esc(DAY_NAMES[s.day].toUpperCase())} · ${esc(SLOT_LABEL[s.slot].toUpperCase())}`, 'Swap meal', `<div class="swap-list">${opts.map(r => `<button class="recipe-card ${cur.recipeId === r.id ? 'on' : ''}" data-action="food-swap-pick" data-id="${esc(r.id)}"><b>${esc(r.name)}</b><span class="small muted">${proteinText(r.nutritionApprox)} · ${r.timeMinutes} min ${cur.recipeId === r.id ? '· current' : ''}</span></button>`).join('')}</div>
        <button class="btn btn-subtle btn-block" style="margin-top:12px" data-action="food-swap-reset">Back to the example meal</button>`);
    }
    if (s.kind === 'log') {
      return wrap('FOOD JOURNAL', 'Log a recipe', `<form id="food-log-form" class="stack" style="gap:12px;margin-top:14px"><div class="form-field"><label for="fl-recipe">Recipe</label><select id="fl-recipe" name="recipe">${CATEGORIES.map(c => `<optgroup label="${c[0].toUpperCase() + c.slice(1)}">${findRecipes({ category: c }).map(r => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('')}</optgroup>`).join('')}</select></div>
        <div class="modal-grid" style="margin-top:0"><div class="form-field"><label for="fl-date">Date</label><input id="fl-date" name="date" type="date" value="${today()}" required/></div><div class="form-field"><label for="fl-serv">Servings</label><select id="fl-serv" name="servings">${SERVING_STEPS.map(v => `<option value="${v}" ${v === 1 ? 'selected' : ''}>${v}</option>`).join('')}</select></div></div>
        <button class="btn btn-dark btn-block" type="submit">${ico('check')} Log as eaten</button></form>`);
    }
    if (s.kind === 'custom') {
      return wrap('FOOD JOURNAL', 'Log a free meal', `<form id="food-custom-form" class="stack" style="gap:12px;margin-top:14px"><div class="form-field"><label for="fc-name">What did you eat?</label><input id="fc-name" name="name" required maxlength="120" placeholder="e.g. Burger and fries with friends"/></div>
        <div class="modal-grid" style="margin-top:0"><div class="form-field"><label for="fc-date">Date</label><input id="fc-date" name="date" type="date" value="${today()}" required/></div><div class="form-field"><label for="fc-protein">Protein · g</label><input id="fc-protein" name="proteinG" type="number" min="0" max="300" inputmode="decimal" placeholder="Unknown"/></div><div class="form-field"><label for="fc-kcal">Energy · kcal</label><input id="fc-kcal" name="kcal" type="number" min="0" max="5000" inputmode="numeric" placeholder="Unknown"/></div></div>
        <div class="form-field"><label for="fc-notes">Notes</label><input id="fc-notes" name="notes" placeholder="Optional"/></div>
        <p class="small muted">Leave numbers blank if you don't know them. They stay unknown, never zero.</p>
        <button class="btn btn-dark btn-block" type="submit">${ico('check')} Log meal</button></form>`);
    }
    return '';
  }
  const open = (s) => { ui.sheet = s; ctx.openSheet(); };
  const close = () => { ui.sheet = null; ctx.closeSheet(); };

  // ---------- Events ----------
  async function click(action, el) {
    const n = N(), date = today();
    switch (action) {
      case 'food-tab': ui.tab = el.dataset.tab; return ctx.render();
      case 'food-session': { const t = el.dataset.type; n.sessionChoice[date] = t; save(); return ctx.render(); }
      case 'food-eat': {
        const slot = el.dataset.slot, ex = n.journal.find(e => e.date === date && e.planned?.slot === slot && e.planned?.date === date);
        if (ex) { n.journal = n.journal.filter(e => e !== ex); save(); ctx.render(); return ctx.toast('Removed from today\'s journal.'); }
        const m = weekPlan(n.weekOverrides)[dayIndex(date)].meals.find(x => x.slot === slot);
        if (!m?.recipe) return;
        n.journal.push(journalEntryFromRecipe(m.recipe, date, 1, { planned: { date, slot } })); save(); ctx.render();
        return ctx.toast(m.recipe.nutritionApprox.proteinG == null ? 'Logged. Nutrition stays unknown.' : `Logged · ≈ ${m.recipe.nutritionApprox.proteinG} g protein`);
      }
      case 'food-recipe': return open({ kind: 'recipe', id: el.dataset.id, servings: 1, portions: {} });
      case 'food-servings': ui.sheet.servings = Number(el.dataset.n); return ctx.openSheet();
      case 'food-cat': ui.cat = el.dataset.cat; return ctx.render();
      case 'food-swap': return open({ kind: 'swap', day: Number(el.dataset.day), slot: el.dataset.slot });
      case 'food-swap-pick': { const { day, slot } = ui.sheet; n.weekOverrides[day] = { ...(n.weekOverrides[day] || {}), [slot]: el.dataset.id }; save(); close(); ctx.render(); return ctx.toast('Meal swapped. Shopping list updated.'); }
      case 'food-swap-reset': { const { day, slot } = ui.sheet; if (n.weekOverrides[day]) delete n.weekOverrides[day][slot]; save(); close(); return ctx.render(); }
      case 'food-people': n.people = Number(el.dataset.n); save(); return ctx.render();
      case 'food-copy': {
        const text = shoppingText(shoppingList(n.weekOverrides, n.people), `Shopping list · week of ${ctx.fmtDate(ctx.weekStart())} · ${n.people} ${n.people === 1 ? 'person' : 'people'}`);
        try { await navigator.clipboard.writeText(text); ctx.toast('Shopping list copied.'); }
        catch { const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {} t.remove(); ctx.toast(ok ? 'Shopping list copied.' : 'Copy not allowed here: select the list and copy it manually.'); }
        return;
      }
      case 'food-open-custom': return open({ kind: 'custom' });
      case 'food-open-log': return open({ kind: 'log' });
      case 'food-choc': n.journal.push(customJournalEntry({ date, name: 'Dark chocolate ~25 g', notes: 'Optional treat' })); save(); ctx.render(); return ctx.toast('Dark chocolate logged.');
      case 'food-del-entry': if (await ctx.askConfirm('Delete this meal from your journal?')) { n.journal = n.journal.filter(e => e.id !== el.dataset.id); save(); ctx.render(); } return;
      case 'food-del-body': if (await ctx.askConfirm('Delete this check-in?')) { n.body = n.body.filter(e => e.id !== el.dataset.id); save(); ctx.render(); } return;
    }
  }
  function submit(form) {
    const n = N(), d = new FormData(form);
    if (form.id === 'food-log-recipe-form') { const r = getRecipe(ui.sheet.id); n.journal.push(journalEntryFromRecipe(r, String(d.get('date')), ui.sheet.servings)); save(); close(); ctx.render(); return ctx.toast('Logged as eaten.'); }
    if (form.id === 'food-log-form') { const r = getRecipe(String(d.get('recipe'))); if (!r) return; n.journal.push(journalEntryFromRecipe(r, String(d.get('date')), Number(d.get('servings')) || 1)); save(); close(); ctx.render(); return ctx.toast('Logged as eaten.'); }
    if (form.id === 'food-custom-form') { const name = String(d.get('name') || '').trim(); if (!name) return ctx.toast('Add a short description.'); n.journal.push(customJournalEntry({ date: String(d.get('date')), name, proteinG: d.get('proteinG'), kcal: d.get('kcal'), notes: d.get('notes') })); save(); close(); ctx.render(); return ctx.toast('Meal logged.'); }
    if (form.id === 'food-body-form') {
      const num = (k) => { const v = d.get(k); return v === '' || v == null ? null : Number(v); };
      const row = { id: `body-${Date.now()}`, date: String(d.get('date')), weight: num('weight'), waist: num('waist'), bloating: num('bloating'), triggers: String(d.get('triggers') || '').trim(), notes: String(d.get('notes') || '').trim() };
      if (row.weight == null && row.waist == null && row.bloating == null && !row.triggers && !row.notes) return ctx.toast('Add at least one value.');
      n.body.push(row); save(); ctx.render(); return ctx.toast('Check-in saved.');
    }
  }
  function input(el) {
    const kind = el.dataset.food;
    if (kind === 'query') { ui.query = el.value; const list = document.getElementById('food-recipe-list'); if (list) list.innerHTML = recipeList(); return; }
    if (kind === 'portion' && ui.sheet?.kind === 'recipe') {
      const v = el.value === '' ? null : Number(el.value);
      if (v == null || !Number.isFinite(v) || v < 0) delete ui.sheet.portions[el.dataset.id]; else ui.sheet.portions[el.dataset.id] = v;
    }
  }
  function change(el) {
    const kind = el.dataset.food, n = N();
    if (kind === 'check') { n.shoppingChecked[el.dataset.id] = el.checked; save(); el.closest('.shop-item')?.classList.toggle('got', el.checked); return; }
    if (kind === 'portion' && ui.sheet?.kind === 'recipe') { input(el); ctx.openSheet(); }
  }
  return { render, sheet, click, submit, input, change, closeSheet: () => { ui.sheet = null; } };
}
