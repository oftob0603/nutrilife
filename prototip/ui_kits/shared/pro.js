/* The PRO feature registry — ONE definition of what PRO includes, read by both the
   paywall (which lists it) and the app (which gates against it).

   Subscription status is a single value, never a boolean beside a role:
     'free'    — no subscription
     'pro'     — active
     'expired' — lapsed; keeps read access to whatever is marked `readable`

   `readable` implements profil-tz §F1: when PRO expires, the journal, weight history and
   progress stay READABLE. Only features that produce new value (scans above the free
   allowance, full recipe text, favourites, reports) actually close. */

const PRO_FEATURES = [
  { id:'skan',       label:'Kuniga 20 tagacha AI skan',             screen:'E2–E7 AI skan',        readable:false },
  { id:'retsept',    label:"Retseptlarni to'liq ko'rish",           screen:'R1–R3 Retseptlar',     readable:false },
  { id:'score',      label:'Nutrition Score',                       screen:'E1 Home',              readable:true  },
  { id:'taklif',     label:'Qolgan kaloriyaga mos taom takliflari', screen:'E1 Home',              readable:false },
  { id:'makro',      label:"Oqsil, yog' va uglevodlarni kuzatish",  screen:'E1 Home, E9 Jurnal',   readable:true  },
  { id:'porsiya',    label:'Aqlli porsiya tavsiyalari',             screen:'E5 Taom, E7 Natija',   readable:false },
  { id:'statistika', label:'Batafsil ovqatlanish statistikasi',     screen:'P1 Statistika',        readable:true  },
  { id:'sevimli',    label:'Sevimli retseptlar',                    screen:'R1 Retseptlar',        readable:false },
  { id:'hisobot',    label:'Haftalik ovqatlanish hisoboti',         screen:'P1 Statistika',        readable:false },
];

/* Daily AI scan allowance. The free plan keeps its existing 3; PRO gets 20 — a real
   ceiling, not "limitsiz". Manual entry is never limited on either plan. */
const SCAN_LIMITS = { free: 3, pro: 20, expired: 3 };

function scanLimit(status) { return SCAN_LIMITS[status] || SCAN_LIMITS.free; }

/* The ONE gate. Pass the whole app object — it carries `proStatus`. */
function proOpen(id, app) {
  const status = (app && app.proStatus) || 'free';
  if (status === 'pro') return true;
  const f = PRO_FEATURES.find((x) => x.id === id);
  return Boolean(f && f.readable && status === 'expired');
}

/* Labels are stored in Uzbek (the source language) and translated HERE, at the single
   boundary every consumer goes through — ProLock titles on Home/Recipes/Statistics and
   the paywall benefit rows all read `proLabel()`. Translating at the registry's exit
   instead of at each call site is what stops a tenth feature, or a new screen, from
   reintroducing an untranslated label. Falls back to Uzbek when i18n is absent, so the
   paywall kit still renders standalone. */
function proLabel(id) {
  const f = PRO_FEATURES.find((x) => x.id === id);
  const raw = f ? f.label : id;
  return typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(raw) : raw;
}

/* Status is persisted so it survives the trip to the paywall, which is a separate page.
   The paywall writes this key on a completed purchase; the app reads it on mount. */
const PRO_KEY = 'nutrilife.pro';

function readProStatus() {
  try {
    const raw = localStorage.getItem(PRO_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v && typeof v.status === 'string' ? v.status : null;
  } catch (e) { return null; }
}

function writeProStatus(status, plan) {
  try {
    localStorage.setItem(PRO_KEY, JSON.stringify({ status, plan: plan || null, at: Date.now() }));
  } catch (e) {}
}

if (typeof window !== 'undefined') Object.assign(window, {
  PRO_FEATURES, SCAN_LIMITS, scanLimit, proOpen, proLabel,
  PRO_KEY, readProStatus, writeProStatus,
});
