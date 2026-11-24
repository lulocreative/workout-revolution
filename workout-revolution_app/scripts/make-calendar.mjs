// Writes assets/wr-training-days.ics: weekly 07:00 (Europe/Oslo) reminders for the training plan,
// each with an alert and a short motivation line. Contains no personal data, so it is safe on the public site.
//   node scripts/make-calendar.mjs [HH:MM]
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [hh, mm] = (process.argv[2] || '07:00').split(':').map(Number);
const time = `${String(hh).padStart(2, '0')}${String(mm).padStart(2, '0')}00`;
const APP = 'https://lulocreative.github.io/workout-revolution/';

// First occurrence of each weekday in the week of 23 Nov 2026; the weekly rule repeats it.
const days = [
  { day: 'MO', date: '20261123', title: 'Pull day 💪', text: 'Back, biceps, traps. Beat last week’s lat pulldown by one clean rep.' },
  { day: 'TU', date: '20261124', title: 'Push day 🔥', text: 'Chest first, control the lowering. One more clean rep than last time.' },
  { day: 'TH', date: '20261126', title: 'Legs day 🦵', text: 'Keep them strong: leg press, curls, calves. Smooth reps, no grinding.' },
  { day: 'SA', date: '20261128', title: 'Chest + Arms 💥', text: 'Short and focused: the second hit your chest and arms need to grow.' }
];
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const stamp = '20261124T120000Z';

const lines = [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Workout Revolution//Training days//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'X-WR-CALNAME:WR training days',
  'BEGIN:VTIMEZONE', 'TZID:Europe/Oslo',
  'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT',
  'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD',
  'END:VTIMEZONE'
];
for (const d of days) {
  lines.push(
    'BEGIN:VEVENT', `UID:wr-${d.day.toLowerCase()}-training@workout-revolution`, `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Oslo:${d.date}T${time}`, 'DURATION:PT15M', `RRULE:FREQ=WEEKLY;BYDAY=${d.day}`,
    `SUMMARY:${esc(d.title)}`, `DESCRIPTION:${esc(`${d.text}\nOpen WR 2.0: ${APP}`)}`, `URL:${APP}`, 'TRANSP:TRANSPARENT',
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0M', `DESCRIPTION:${esc(`${d.title} ${d.text}`)}`, 'END:VALARM',
    'END:VEVENT'
  );
}
lines.push('END:VCALENDAR');
// RFC 5545: fold lines longer than 75 octets (continuation lines start with a space).
const fold = (line) => { const out = []; let cur = ''; for (const ch of line) { if (Buffer.byteLength(cur + ch) > (out.length ? 74 : 75)) { out.push(cur); cur = ''; } cur += ch; } out.push(cur); return out.join('\r\n '); };
await writeFile(join(root, 'assets', 'wr-training-days.ics'), lines.map(fold).join('\r\n') + '\r\n');
console.log(`assets/wr-training-days.ics written (${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')} Europe/Oslo)`);
