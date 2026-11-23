// Evidence-based, intentionally conservative rules. All loads in kg.
export const toNumber = (value) => value === '' || value == null ? null : Number(value);
export const roundTo = (value, step = 2.5) => Math.round(value / step) * step;
export const lastValidSet = (rows = []) => [...rows].reverse().find(s => Number.isFinite(Number(s.reps)) && Number(s.reps) > 0 && Number.isFinite(Number(s.weight)) && s.weight !== null && s.weight !== '') || null;
export const actualSets = (rows = []) => rows.filter(s => Number(s.reps) > 0 && s.weight !== '' && s.weight != null && Number.isFinite(Number(s.weight)));
export function osloToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(now);
  const get = x => parts.find(p=>p.type===x)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function sessionsInDays(sessions, days = 28, now = new Date()) {
  const today = new Date(`${osloToday(now)}T12:00:00Z`).getTime();
  const floor = today - (days - 1)*86400000;
  return sessions.filter(s => s.date && new Date(`${s.date}T12:00:00Z`).getTime() >= floor && new Date(`${s.date}T12:00:00Z`).getTime() <= today).length;
}
export function comparableHistory(history, exerciseId, machineId, before = null) {
  return history.filter(s=>!before || s.date < before).flatMap(s => (s.exercises||[]).filter(e=>e.exerciseId===exerciseId && e.machineId===machineId).map(e=>({...e,date:s.date,sessionId:s.id,source:s.source}))).sort((a,b)=>b.date.localeCompare(a.date));
}
function matchingRecent(history, exerciseId, machineId, before) {
  const ex = comparableHistory(history, exerciseId, machineId, before);
  return ex.find(e=>actualSets(e.sets).length>0) || null;
}
export function recommend(exercise, history, opts = {}) {
  const { before = null, readiness = null } = opts;
  const prescribed = exercise.sets.map(s=>({...s}));
  const previous = matchingRecent(history, exercise.id, exercise.machineId, before);
  const increment = exercise.increment ?? 2.5;
  const isUnsafe = readiness && (readiness.dizzy || readiness.pain || readiness.faint || readiness.energy <= 2);
  if (isUnsafe) return {action:'stop', title:'Do not train through symptoms', reason:'Active dizziness, pain or severely low energy needs a pause and assessment, not a heavier set.', sets: prescribed, evidence:[]};
  if (!previous) return {action:'baseline', title:'Establish a baseline', reason:'No completed set on this exact machine/setup is confirmed yet. Starting loads are proposals, not recorded personal bests.', sets:prescribed, evidence:[]};
  const completed = actualSets(previous.sets);
  const hadIssue = Boolean(previous.pain || previous.dizziness || previous.formIssue || previous.discomfort || previous.unusualFatigue || completed.some(s=>s.pain||s.dizziness||s.formIssue||s.discomfort||s.unusualFatigue));
  const plannedCount = Number(previous.plannedSets ?? prescribed.length);
  const candidate = lastValidSet(completed);
  const evidence = completed.map(s=>`${s.weight} kg × ${s.reps}${s.rir != null ? ` · RIR ${s.rir}` : ''}`);
  const reference = candidate?.weight ?? prescribed[0]?.weight;
  const top = Math.max(...prescribed.map(s=>Number(s.repMax ?? s.reps ?? 12)));
  // Historic partial logs are evidence for reference weight, never evidence that all sets passed.
  const complete = previous.source === 'recorded' && completed.length >= plannedCount && plannedCount > 0;
  const allTop = complete && completed.every((s,i) => Number(s.reps) >= Number(prescribed[Math.min(i,prescribed.length-1)].repMax ?? top) && s.rir != null && Number(s.rir) >= 1);
  if (hadIssue) return {action:'review',title:'Hold and check technique',reason:'The previous exposure included discomfort, dizziness or a form flag. Do not progress until the issue is resolved.',sets:prescribed.map(s=>({...s,weight:reference})),evidence};
  const lowEnergy = readiness && (readiness.energy <= 5 || (readiness.sleepHours != null && readiness.sleepHours < 6));
  if (lowEnergy) return {action:'lighter',title:'Reduced-load day',reason:'Readiness is below normal. Aim for good reps at a lighter load and reduce the final set if needed.', sets:prescribed.map(s=>({...s,weight:roundTo((reference||s.weight)*0.9,exercise.increment||2.5)})).slice(0,Math.max(1,prescribed.length-1)),evidence};
  if (allTop) return {action:'increase',title:'Add the smallest increment',reason:'All required sets reached the top of their rep range on the same machine with at least 1 rep in reserve.',sets:prescribed.map(s=>({...s,weight:roundTo(Number(s.weight)+increment,increment)})),evidence};
  const recentFull = comparableHistory(history, exercise.id, exercise.machineId, before).filter(e=>e.source==='recorded' && actualSets(e.sets).length >= prescribed.length && !e.formIssue && !e.dizziness && !e.pain).slice(0,3);
  if(recentFull.length===3){const signatures=recentFull.map(e=>actualSets(e.sets).slice(0,prescribed.length).map(s=>[Number(s.weight),Number(s.reps)]));const sameWeights=signatures.every(sig=>sig.every((pair,i)=>pair[0]===signatures[0][i][0]));const reps=signatures.map(sig=>sig.reduce((a,pair)=>a+pair[1],0));if(sameWeights && Math.max(...reps)-Math.min(...reps)<=1)return {action:'plateau',title:'Three similar exposures stalled',reason:'Three complete exposures on the same machine show no meaningful rep progress. Review recovery, sleep, technique and load before changing the exercise.',sets:prescribed,evidence};}

  // Don't auto-increase just because one partial or one good top set exists.
  return {action:'reps',title:'Build reps before load',reason:complete?'Last session did not clear the entire prescribed rep range. Keep the load and aim for one clean rep more.':'The available log is incomplete. Keep the programmed load and collect complete set data before changing it.',sets:prescribed,evidence};
}
export function readinessDecision(x, recent = []) {
  if (x.dizzy || x.faint || x.pain || Number(x.energy) <= 2) return {level:'stop',label:'Pause training',reason:'Active pain, dizziness or near-fainting is a stop signal. Do not train through it.'};
  if (Number(x.energy) <= 5 || (x.sleepHours != null && x.sleepHours !== '' && Number(x.sleepHours)<6) || x.unusualFatigue) return {level:'modified',label:'Reduced session',reason:'Poor recovery suggests reducing the load and/or set count, not forcing a fourth workout.'};
  if (recent.length >= 4 && !x.extraDay) return {level:'check',label:'Check weekly load',reason:'Already four workouts this week. Another session needs a specific reason and sufficient recovery.'};
  return {level:'ready',label:'Ready to train',reason:'No reported stop signals. Use working sets and adjust from actual performance.'};
}
export function buildSummary(session) {
  const actual = (session.exercises||[]).flatMap(e=>actualSets(e.sets).map(s=>({...s,exerciseId:e.exerciseId})));
  return {sets:actual.length,reps:actual.reduce((a,s)=>a+Number(s.reps||0),0),volume:Math.round(actual.reduce((a,s)=>a+Number(s.weight||0)*Number(s.reps||0),0)), exercises:new Set(actual.map(s=>s.exerciseId)).size};
}
export function statusForProgram(exercise, history, readiness) {return recommend(exercise,history,{readiness})}
// Next core workout in the rotation, based on the most recent CORE session (the optional Focus day is ignored).
export function nextWorkout(history = [], order = ['pull', 'legs', 'push']) {
  const last = [...history].filter(s => order.includes(s.type)).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!last) return order[0];
  return order[(order.indexOf(last.type) + 1) % order.length];
}
// Sessions in the current calendar week (Monday–Sunday, Europe/Oslo).
export function sessionsThisWeek(sessions = [], now = new Date()) {
  const today = osloToday(now);
  const d = new Date(`${today}T12:00:00Z`);
  const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000).toISOString().slice(0, 10);
  return sessions.filter(s => s.date && s.date >= monday && s.date <= today).length;
}
// Ramp-up warm-up sets before the first heavy lift of a muscle group: ~50% x10, ~70% x5, ~85% x3 of the first
// working weight, rounded DOWN to the machine's increment. Warm-ups never count as working sets or progression.
export const WARMUP_LIFTS = new Set(['incline-db', 'flat-db', 'lat-pd', 'seated-row', 'leg-press']);
export function warmupSets(workWeight, increment = 2.5) {
  const w = Number(workWeight), inc = Number(increment) || 2.5;
  if (!Number.isFinite(w) || w <= 0) return [];
  const out = [];
  for (const [pct, reps] of [[0.5, 10], [0.7, 5], [0.85, 3]]) {
    const kg = Math.floor((w * pct) / inc + 1e-9) * inc;
    const weight = Math.round(kg * 100) / 100;
    if (weight > 0 && weight < w && !out.some(s => s.weight === weight)) out.push({ weight, reps });
  }
  return out;
}
// Adds warm-ups to the first eligible lift of each muscle group in a session.
export function withWarmups(exercises) {
  const seen = new Set();
  return exercises.map(e => {
    const first = !seen.has(e.groups); seen.add(e.groups);
    const sets = first && WARMUP_LIFTS.has(e.id) ? warmupSets(e.targetSets?.[0]?.weight ?? e.sets?.[0]?.weight, e.increment) : [];
    return { ...e, warmups: sets.map(s => ({ ...s, done: false })) };
  });
}
