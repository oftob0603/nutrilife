/* The nutrition plan — ONE definition of the daily target formula.

   This was previously inside the onboarding kit alone, which meant the mobile app could
   not recompute a target even though two of its screens claim to (saving a weight, and
   editing personal info). Those screens showed hardcoded numbers instead. The formula
   lives here so onboarding, the app and the prototype shell all compute from the same
   source and cannot drift apart.

   DESIGN/onboarding-tz §5 — Mifflin-St Jeor, then activity, then the goal adjustment. */

/* Captions are USER-FACING copy only. The `adj` beside each one is what actually drives
   the calorie target — the percentages were removed from the captions, not from the
   maths, so −15% / +12% / +10% still apply exactly as before. */
const MAQSADLAR = [
  { value:'yoqotish', label:"Vazn tashlash", caption:"Ortiqcha vazndan xalos bo'ling", adj:-0.15 },
  { value:'saqlash', label:"Vaznni saqlash", caption:'Hozirgi vazningizni ushlab turing', adj:0 },
  { value:'oshirish', label:"Vazn oshirish", caption:"Sog'lom yo'l bilan vazn qo'shing", adj:0.12 },
  { value:'mushak', label:"Mushak yig'ish", caption:'Mushak massasini oshiring', adj:0.10 },
];
const GENDERS = [
  { value:'erkak', label:'Erkak' },
  { value:'ayol', label:'Ayol' },
  { value:'aytmayman', label:"Aytishni xohlamayman" },
];
const ACTIVITY = [
  { value:'kam', label:'Kam harakat', caption:"Asosan o'tirib ishlayman", k:1.2 },
  { value:'yengil', label:'Yengil faol', caption:'Haftada 1\u20133 kun harakat', k:1.375 },
  { value:'ortacha', label:"O'rtacha faol", caption:'Haftada 3\u20135 kun mashq', k:1.55 },
  { value:'juda', label:'Juda faol', caption:"Haftada 6\u20137 kun mashq yoki og'ir jismoniy ish", k:1.725 },
];

function normaHisobi({ gender, age, height, weight, activity, goal }) {
  const w = Number(weight)||0, h = Number(height)||0, a = Number(age)||0;
  const male = 10*w + 6.25*h - 5*a + 5;
  const female = 10*w + 6.25*h - 5*a - 161;
  const bmr = gender === 'erkak' ? male : gender === 'ayol' ? female : (male+female)/2;
  const k = (ACTIVITY.find(x=>x.value===activity)||{}).k || 1.2;
  const adj = (MAQSADLAR.find(x=>x.value===goal)||{}).adj || 0;
  let kcal = Math.round(bmr * k * (1+adj));
  const floor = gender === 'ayol' ? 1200 : 1500;
  const clamped = kcal < floor;
  if (clamped) kcal = floor;
  const split = goal === 'mushak' ? { p:0.30, f:0.25, c:0.45 } : { p:0.25, f:0.30, c:0.45 };
  return {
    kcal,
    tdee: Math.round(bmr * k),
    clamped,
    wide: gender === 'aytmayman',
    macros: [
      { key:'Oqsil', pct:Math.round(split.p*100), g:Math.round(kcal*split.p/4) },
      { key:"Yog'", pct:Math.round(split.f*100), g:Math.round(kcal*split.f/9) },
      { key:'Uglevod', pct:Math.round(split.c*100), g:Math.round(kcal*split.c/4) },
    ],
  };
}

/* The app's PROFILE stores LABELS ("Erkak", "O'rtacha faol", "Vazn tashlash") because
   that is what its rows display, while the formula keys on values ('erkak', 'ortacha',
   'yoqotish'). Without this mapping the app cannot feed its own profile back into the
   formula — which is exactly why its two "norma recomputed" screens were faking it.
   Falls back to the stored value when it is already a key, so either form works. */
const qiymat = (table, labelOrValue) => {
  const hit = table.find((x) => x.label === labelOrValue || x.value === labelOrValue);
  if (hit) return hit.value;
  // The profile screen's gender control shows a shortened "Aytmayman" where the
  // questionnaire says "Aytishni xohlamayman"; both mean the same answer.
  if (/^Aytmayman$/i.test(String(labelOrValue || ''))) return 'aytmayman';
  /* Legacy: the gain-weight goal was once «Vazn ortdirish» / 'ortdirish'. A session or
     profile stored under the old wording must still resolve — otherwise its daily target
     would silently lose the +12% adjustment and look like plain maintenance. */
  if (/^(Vazn ortdirish|ortdirish)$/.test(String(labelOrValue || ''))) return 'oshirish';
  return undefined;
};

/* The daily target for a profile. The weight must be resolvable — either passed in or
   present on the profile — and returns null when it is not: PROFILE deliberately does
   not store a weight (it lives in the weight log), so defaulting silently would hand the
   caller the 1,200/1,500 kcal floor, a plausible-looking wrong number, instead of failing. */
function planFromProfile(profile, weightOverride) {
  if (!profile) return null;
  const weight = Number(weightOverride != null ? weightOverride : profile.joriy_vazn) || 0;
  if (weight <= 0) return null;
  return normaHisobi({
    gender: qiymat(GENDERS, profile.jins),
    age: profile.yosh,
    height: profile.boy,
    weight,
    activity: qiymat(ACTIVITY, profile.faollik),
    goal: qiymat(MAQSADLAR, profile.maqsad),
  });
}

/* The three macro grams keyed the way GOALS stores them, so a plan can be written onto
   the app's goal object without every caller repeating the label matching. */
function macrosOf(plan) {
  const out = {};
  if (!plan) return out;
  plan.macros.forEach((m) => {
    if (/Oqsil/.test(m.key)) out.p = m.g;
    if (/Yog/.test(m.key)) out.fat = m.g;
    if (/Uglevod/.test(m.key)) out.c = m.g;
  });
  return out;
}

const tmi = (kg, sm) => (sm > 0 ? Number(kg) / Math.pow(Number(sm) / 100, 2) : 0);

// ~7,700 kcal per kg of body mass — the standard energy equivalent.
const KCAL_PER_KG = 7700;

/* Estimated time to the goal weight, from the user's own numbers. Rates are capped, not
   invented: a target implying a faster change than the ceiling is reported at the
   ceiling, so an aggressive calorie goal cannot produce an unrealistic date.
     loss   — 1% of body weight per week
     gain   — 0.5% per week
     muscle — 0.25% per week, by target rather than by surplus, since not all gained
              mass is muscle */
function maqsadMuddati({ goal, weight, target, kcal, tdee }) {
  const w = Number(weight) || 0, t = Number(target) || 0;
  const dailyTarget = Number(kcal) || 0, maintain = Number(tdee) || 0;
  if (goal === 'saqlash' || !w || !t || !dailyTarget || !maintain) return null;

  const diff = Math.abs(w - t);
  if (diff < 0.5) return null;

  let perWeek;
  if (goal === 'mushak') {
    if (dailyTarget - maintain <= 0) return null;
    perWeek = w * 0.0025;
  } else if (goal === 'yoqotish') {
    const deficit = maintain - dailyTarget;
    if (deficit <= 0) return null;
    perWeek = Math.min((deficit * 7) / KCAL_PER_KG, w * 0.01);
  } else {
    const surplus = dailyTarget - maintain;
    if (surplus <= 0) return null;
    perWeek = Math.min((surplus * 7) / KCAL_PER_KG, w * 0.005);
  }
  if (!perWeek || perWeek <= 0) return null;

  const weeks = Math.max(1, Math.round(diff / perWeek));
  return { weeks, perWeek, matn: haftaMatni(weeks) };
}

// "10 hafta" under three months; "2 oy 2 hafta" beyond, dropping a zero remainder.
function haftaMatni(weeks) {
  if (weeks < 12) return weeks + ' hafta';
  let months = Math.floor(weeks / 4.345);
  let rem = Math.round(weeks - months * 4.345);
  if (rem >= 4) { months += 1; rem = 0; }
  return rem > 0 ? months + ' oy ' + rem + ' hafta' : months + ' oy';
}

/* ONE number formatter. The app kit and the onboarding kit each defined their own `fmt`
   with different behaviour (one rounded, one did not) and both wrote it to the same
   global — so in the prototype, where both kits load, formatting depended on script
   order. Rounds, because every figure it formats is a whole kcal or gram. */
const fmt = (n) => Math.round(Number(n)).toLocaleString('en-US');

if (typeof window !== 'undefined') Object.assign(window, {
  MAQSADLAR, GENDERS, ACTIVITY, normaHisobi, planFromProfile, macrosOf,
  maqsadMuddati, haftaMatni, tmi, fmt, KCAL_PER_KG,
});
