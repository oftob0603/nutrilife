// Prices arrive from the API as { id, nomi, price, months, badge }. Everything shown —
// per-month figure, savings percent — is computed here at render time, so a price change
// in the admin panel updates every label with no string edits.
const PLANS = [
  { id:'oylik',  nomi:'Oylik',   price:39000,  months:1 },
  { id:'olti',   nomi:'6 oylik', price:170000, months:6 },
  { id:'yillik', nomi:'Yillik',  price:290000, months:12, badge:'Tavsiya etiladi' },
];

const som = (n) => Number(n).toLocaleString('en-US');

// Rounded to the nearest 100 so'm — the app never shows tiyin.
const oyiga = (plan) => Math.round(plan.price / plan.months / 100) * 100;

// savings% = round((1 − plan_price / (monthly_price × months)) × 100)
const tejash = (plan, monthly) => {
  if (!monthly || plan.months === 1) return 0;
  return Math.round((1 - plan.price / (monthly * plan.months)) * 100);
};

const planTavsifi = (plan, monthly) => {
  if (plan.months === 1) return som(plan.price) + " so'm / oy";
  const t = tejash(plan, monthly);
  return '\u2248' + som(oyiga(plan)) + " so'm / oy" + (t > 0 ? ' \u00B7 ' + t + '% tejash' : '');
};

// The nine PRO features, in the order the product owner listed them. Ids match
// ui_kits/shared/pro.js so the paywall and the in-app locks cannot drift apart.
const BENEFIT_ICONS = {
  skan:'scan-line', retsept:'book-open', score:'circle-gauge', taklif:'utensils',
  makro:'chart-pie', porsiya:'scale', statistika:'chart-line', sevimli:'heart',
  hisobot:'calendar-days',
};
// Built from the shared registry — the paywall cannot advertise a feature the app does
// not gate, because both read PRO_FEATURES. shared/pro.js is a required prerequisite
// script; if it ever fails to load the list is empty rather than silently stale.
const BENEFITS = (typeof PRO_FEATURES !== 'undefined' ? PRO_FEATURES : [])
  .map((f) => ({ id:f.id, icon:BENEFIT_ICONS[f.id] || 'check', text:f.label }));

const SARLAVHA = {
  onboarding: "NutriLife PRO bilan ko'proq",
  profile:    'NutriLife PRO',
  limit:      'Bepul skanlar tugadi',
  recipe:     "Retseptlar PRO ichida",
};

Object.assign(window, { PLANS, som, oyiga, tejash, planTavsifi, BENEFITS, SARLAVHA });
