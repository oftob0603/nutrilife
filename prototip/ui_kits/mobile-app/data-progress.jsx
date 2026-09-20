// Statistika (P1–P3) and Profil (F1–F5) sample data.
// Definitions are fixed in progress-tz §1: a tracked day has at least one CONFIRMED
// entry; today without an entry does NOT break the streak because the day is not over.

// Weight log, oldest first. `iso` is the stored value; everything shown is derived from
// it, so no display string is hardcoded twice. The first record comes from onboarding
// and cannot be deleted — it is the chart's starting point (P3).
const WEIGHTS = [
  { id:1, iso:'2026-08-15', kg:88.4, onboarding:true },
  { id:2, iso:'2026-08-19', kg:88.0 },
  { id:3, iso:'2026-08-24', kg:87.3 },
  { id:4, iso:'2026-08-29', kg:87.6 },
  { id:5, iso:'2026-09-02', kg:86.9 },
  { id:6, iso:'2026-09-07', kg:86.2 },
  { id:7, iso:'2026-09-11', kg:85.6 },
  { id:8, iso:'2026-09-15', kg:85.0 },
];

// Display form derived from the stored ISO date.
const sanaQisqa = (iso) => { const [y,m,d] = iso.split('-'); return d + '.' + m; };

// Last 30 days, oldest first — DERIVED from the journal history, so a day counts as
// tracked exactly when it has entries. Nothing here is a second hardcoded list.
const TRACKED = HISTORY.map((d) => ({
  sana: sanaQisqa(d.iso),
  iso: d.iso,
  tracked: d.entries.length > 0,
}));

// Streak counted from the real tracked flags: run back from the most recent tracked
// day, and find the longest run anywhere in the window.
const streakFromFlags = (flags) => {
  let joriy = 0;
  for (let i = flags.length - 1; i >= 0 && flags[i]; i--) joriy++;
  let eng = 0, run = 0;
  flags.forEach((on) => { run = on ? run + 1 : 0; if (run > eng) eng = run; });
  return { joriy, eng_uzun: eng, jami: flags.filter(Boolean).length };
};

const STREAK = streakFromFlags(TRACKED.map((d) => d.tracked));

/* The streak for a LIVE history — the seeded days plus whatever the user has logged this
   session. The app used to read STREAK, frozen at module load, so logging the first entry
   of an untracked day left the streak unchanged. `bonus` is the states panel's demo
   increment and is added on top rather than replacing the count. */
function streakOf(history, bonus) {
  const s = streakFromFlags((history || []).map((d) => d.entries.length > 0));
  const add = Number(bonus) || 0;
  if (!add) return s;
  return { joriy: s.joriy + add, eng_uzun: Math.max(s.eng_uzun, s.joriy + add), jami: s.jami + add };
}

/* `joriy_vazn` and `norma` are NOT stored here. The current weight is the last record in
   the weight log and the daily norm is GOALS.kcal; keeping second copies meant the
   profile kept showing 85.0 kg and 2,190 kcal after the user recorded a new weight.
   app.jsx derives both onto the profile object it passes down. */
const PROFILE = {
  ism: 'Aziz',
  kun: 24,
  maqsad: 'Vazn tashlash',
  maqsad_vazn: 82,
  jins: 'Erkak',
  yosh: 31,
  boy: 178,
  faollik: "O'rtacha faol",
  afzalliklar: ["Cheklov yo'q"],
  odatlar: 'Kuniga 3 mahal · aralash',
};

/* The seed target is DERIVED from the seed profile rather than typed in. The two were
   inconsistent: PROFILE describes a 31-year-old, 178 cm, 85 kg moderately-active man
   losing weight — which the §5 formula puts at 2,388 kcal — while GOALS separately
   declared 2,190, with macros matching neither. Everything computed against the target
   (Nutrition Score's shares, the "within goal" day counts, the remaining-calorie
   suggestion) was therefore scoring the journal against a target the profile did not
   imply. The standalone kit now starts self-consistent; the prototype still overwrites
   both from the user's real onboarding answers. */
if (typeof GOALS !== 'undefined' && typeof planFromProfile === 'function') {
  const seedPlan = planFromProfile(PROFILE, WEIGHTS[WEIGHTS.length - 1].kg);
  if (seedPlan) {
    const m = macrosOf(seedPlan);
    Object.assign(GOALS, { kcal: seedPlan.kcal, p: m.p || GOALS.p, fat: m.fat || GOALS.fat, c: m.c || GOALS.c });
  }
}

const SETTINGS = {
  til: "O'zbekcha",
  mavzu: 'Tizim',
  vazn_birligi: 'kg',
  boy_birligi: 'sm',
  energiya: 'kkal',
  bildirishnoma: "o'chirilgan",
};

/* USER_PAYMENTS, not PAYMENTS: the admin kit defines its own `PAYMENTS` revenue ledger on
   the same global namespace, and the prototype loads both. This is the user's own receipt
   list for F4. */
const USER_PAYMENTS = [
  { id:1, sana:'14.09.2026', summa:"34 000 so'm", usul:'Payme', holat:"To'langan" },
  { id:2, sana:'14.08.2026', summa:"34 000 so'm", usul:'Click', holat:"To'langan" },
  { id:3, sana:'14.07.2026', summa:"34 000 so'm", usul:'Telegram Stars', holat:"To'langan" },
];

const kg1 = (n) => Number(n).toFixed(1).replace('.', ',');
// Signed delta, comma decimal separator, minus sign (not a hyphen).
const delta = (a, b) => {
  const d = a - b;
  const s = Math.abs(d).toFixed(1).replace('.', ',');
  return (d > 0 ? '+' : d < 0 ? '\u2212' : '') + s;
};

const sanaToliq = (iso) => { const [y,m,d] = iso.split('-'); return d + '.' + m + '.' + y; };
const kunlar = (isoA, isoB) => Math.round((new Date(isoB) - new Date(isoA)) / 86400000);

// Chart/history points carry both forms so nothing is formatted twice downstream.
const weightPoints = (list) => list.map((w) => ({ ...w, sana: sanaQisqa(w.iso), toliq: sanaToliq(w.iso) }));

// How far the user has come, as a share of the whole journey (start -> goal).
// Returns null when the start already equals the goal — there is no journey to measure.
function maqsadFoizi(list, maqsad) {
  if (!list.length) return null;
  const start = list[0].kg, now = list[list.length-1].kg;
  const total = start - maqsad;
  if (Math.abs(total) < 0.05) return null;
  const done = start - now;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

// Average weekly change. Needs at least two measurements spanning >= 14 days —
// below that the number is noise, so the caller hides the section rather than
// inventing a value.
function haftalikOzgarish(list) {
  if (list.length < 2) return null;
  const a = list[0], b = list[list.length-1];
  const days = kunlar(a.iso, b.iso);
  if (days < 14) return null;
  return ((b.kg - a.kg) / (days / 7));
}

Object.assign(window, {
  WEIGHTS, TRACKED, STREAK, streakOf, PROFILE, SETTINGS, USER_PAYMENTS,
  kg1, delta, sanaQisqa, sanaToliq, kunlar, weightPoints, maqsadFoizi, haftalikOzgarish,
});
