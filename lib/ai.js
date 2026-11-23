// AI coach: bring-your-own-key chat with OpenAI or Anthropic, called directly from the browser.
// No SDK on purpose: the app has zero runtime dependencies and no build step (see AGENTS.md).
// The API key lives in its own localStorage entry so it is never included in JSON backups.
const AI_KEY = 'workout-revolution-ai-settings';
export const PROVIDERS = {
  openai: { label: 'OpenAI (ChatGPT)', defaultModel: 'gpt-5-mini', keyHint: 'sk-…', keyUrl: 'platform.openai.com/api-keys' },
  anthropic: { label: 'Anthropic (Claude)', defaultModel: 'claude-opus-5-5', keyHint: 'sk-ant-…', keyUrl: 'console.anthropic.com/settings/keys' }
};
export function loadAISettings() {
  try { const v = JSON.parse(localStorage.getItem(AI_KEY) || 'null'); if (v && PROVIDERS[v.provider]) return v; } catch {}
  return { provider: 'openai', model: PROVIDERS.openai.defaultModel, apiKey: '' };
}
export function saveAISettings(s) { try { localStorage.setItem(AI_KEY, JSON.stringify(s)); return true; } catch { return false; } }
export function clearAIKey() { const s = loadAISettings(); s.apiKey = ''; saveAISettings(s); return s; }

const RULES = `You are the in-app strength coach for Workout Revolution 2.0, coaching ONE specific athlete whose real data is below.
Rules you must follow:
- Base every answer on the athlete's actual logged data. Distinguish actual logged sets, partial historical reports and planned loads. Never invent past sets or numbers that are not in the data; say when data is missing.
- Compare progress only on the same exercise AND the same machine/setup.
- Progression: add reps before load. Recommend a load increase only when all required work sets reached the top of their rep range with RIR >= 1 and no pain, dizziness or form flags.
- Do not suggest Romanian deadlifts. Check the athlete data for any history of dizziness. Active dizziness, pain or near-fainting means stop training and get it assessed; do not suggest training through it. You are not a doctor and must not diagnose.
- Keep the three core sessions (Push, Pull, Legs) plus an optional, recovery-gated fourth Focus day. Keep the athlete's favourite exercises (cable lateral raises, Smith shrugs, V-handle pushdowns, lying leg curls). No novelty swaps.
- Be independent and evidence-based: do not change your position just because the athlete pushes back; change it only when given new evidence.
- Be concise and practical. Plain language, short paragraphs or bullet points. No hype or generic motivation.
- Units are kg. Today's date (Europe/Oslo) is given in the data.
Proposing program changes:
- The app can apply exactly one kind of change: the number of working sets (1-6) for one exercise in one workout.
- Only propose when the data supports it. Explain the measurable reason in your reply, then end the message with exactly one block in this format and nothing after it:
\`\`\`proposal
{"workout":"push","exerciseId":"flat-db","sets":3,"reason":"One sentence, measurable reason"}
\`\`\`
- workout must be one of push, pull, legs, focus; exerciseId must be an id from that workout in the data. Never propose any other kind of change in this format.`;

export function buildSystemPrompt(context) {
  return `${RULES}\n\nATHLETE DATA (JSON):\n${JSON.stringify(context)}`;
}

export function parseProposal(text) {
  const m = String(text || '').match(/```proposal\s*([\s\S]*?)```/);
  if (!m) return { text: String(text || '').trim(), proposal: null };
  const clean = String(text).replace(m[0], '').trim();
  try { const p = JSON.parse(m[1]); return { text: clean, proposal: p && typeof p === 'object' ? p : null }; }
  catch { return { text: clean, proposal: null }; }
}

// Returns {ok:true, ...normalized} or {ok:false, error}
export function validateProposal(p, program) {
  if (!p) return { ok: false, error: 'No proposal' };
  const workout = String(p.workout || '').toLowerCase();
  const plan = program[workout];
  if (!plan) return { ok: false, error: `Unknown workout "${p.workout}"` };
  const ex = plan.exercises.find(e => e.id === p.exerciseId);
  if (!ex) return { ok: false, error: `Exercise "${p.exerciseId}" is not in ${plan.label}` };
  const sets = Number(p.sets);
  if (!Number.isInteger(sets) || sets < 1 || sets > 6) return { ok: false, error: 'Set count must be a whole number from 1 to 6' };
  const reason = String(p.reason || '').trim();
  if (reason.length < 10) return { ok: false, error: 'The coach did not give a usable reason' };
  if (sets === ex.sets.length) return { ok: false, error: 'No change from the current set count' };
  return { ok: true, workout, exerciseId: ex.id, exerciseName: ex.name, oldCount: ex.sets.length, newCount: sets, reason };
}

async function readError(res) {
  let detail = '';
  try { const j = await res.json(); detail = j?.error?.message || j?.message || ''; } catch {}
  if (res.status === 401) return 'The API key was rejected. Check it in Settings.';
  if (res.status === 429) return 'Rate limit or credit limit reached at the provider. Try again shortly or check your billing.';
  if (res.status === 404) return `Model not found. Check the model name in Settings.${detail ? ' (' + detail + ')' : ''}`;
  return `Provider error ${res.status}${detail ? ': ' + detail : ''}`;
}

// messages: [{role:'user'|'assistant', content:string}]
export async function askCoach(settings, system, messages, { signal } = {}) {
  if (!settings?.apiKey) throw new Error('Add an API key in Settings first.');
  if (settings.provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'anthropic-beta': 'server-side-fallback-2026-07-01'
      },
      body: JSON.stringify({
        model: settings.model || PROVIDERS.anthropic.defaultModel,
        max_tokens: 16000,
        output_config: { effort: 'low' },
        fallbacks: 'default',
        cache_control: { type: 'ephemeral' },
        system,
        messages
      })
    });
    if (!res.ok) throw new Error(await readError(res));
    const data = await res.json();
    if (data.stop_reason === 'refusal') throw new Error('The model declined to answer this message. Try rephrasing it.');
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
    if (!text) throw new Error('The model returned an empty answer.');
    return text;
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', signal,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${settings.apiKey}` },
    body: JSON.stringify({ model: settings.model || PROVIDERS.openai.defaultModel, messages: [{ role: 'system', content: system }, ...messages] })
  });
  if (!res.ok) throw new Error(await readError(res));
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('The model returned an empty answer.');
  return text;
}
