const SECTIONS = [
  { id:'a1',  label:'Boshqaruv paneli', icon:'layout-dashboard' },
  { id:'a2',  label:'Foydalanuvchilar', icon:'users' },
  { id:'a4',  label:'Takliflar navbati', icon:'inbox', count:7 },
  { id:'a6',  label:'Taomlar bazasi', icon:'utensils' },
  { id:'a8',  label:'Retseptlar', icon:'book-open' },
  { id:'a10', label:'Statistika', icon:'chart-line' },
  { id:'a11', label:"So'rovlar", icon:'message-square-warning', count:2 },
  { id:'a12', label:'Narxlar', icon:'tag' },
];

const USERS = [
  { id:1, ism:'Aziz Karimov', tgid:'184920113', rol:'PRO', obuna:'Yillik', tugash:'2027-03-14', royxat:'2026-01-08', faollik:'bugun', skan:412, til:"O'zbekcha", manba:'tolov' },
  { id:2, ism:'Dilnoza Yusupova', tgid:'207713948', rol:'FREE', obuna:'—', tugash:'—', royxat:'2026-02-19', faollik:'bugun', skan:86, til:"O'zbekcha", manba:null },
  { id:3, ism:'Sardor Rahimov', tgid:'391044827', rol:'FREE', obuna:'—', tugash:'—', royxat:'2026-05-02', faollik:'3 kun oldin', skan:19, til:'Русский', manba:null },
  { id:4, ism:'Kamola Tosheva', tgid:'118273640', rol:'PRO', obuna:'Oylik', tugash:'2026-09-19', royxat:'2025-11-30', faollik:'kecha', skan:1043, til:"O'zbekcha", manba:'qolda' },
  { id:5, ism:'Jasur Abdullayev', tgid:'552910374', rol:'Bloklangan', obuna:'—', tugash:'—', royxat:'2026-04-11', faollik:'21 kun oldin', skan:7, til:'English', manba:null },
  { id:6, ism:'Nilufar Ergasheva', tgid:'463028175', rol:'PRO', obuna:'6 oylik', tugash:'2026-09-21', royxat:'2026-03-21', faollik:'bugun', skan:268, til:"O'zbekcha", manba:'tolov' },
];

const SUGGESTIONS = [
  { id:'t-104', sana:'2026-09-02', kim:'Dilnoza Yusupova', ai:'Palov, 420 kkal / 100 g', tuzatish:"Toshkent oshi, 380 kkal / 100 g", holat:'yangi', bazada:"Osh (palov)" },
  { id:'t-105', sana:'2026-09-04', kim:'Aziz Karimov', ai:'Somsa, 290 kkal / 100 g', tuzatish:"Go'shtli somsa, 312 kkal / 100 g", holat:'yangi', bazada:'Somsa' },
  { id:'t-106', sana:'2026-09-06', kim:'Kamola Tosheva', ai:'Lagman, 180 kkal / 100 g', tuzatish:"Qovurma lagmon, 214 kkal / 100 g", holat:"ko'rib chiqilmoqda", bazada:null },
  { id:'t-107', sana:'2026-09-09', kim:'Nilufar Ergasheva', ai:'Non, 250 kkal / 100 g', tuzatish:'Obi non, 262 kkal / 100 g', holat:'yangi', bazada:'Non' },
];

const DISHES = [
  { id:1, uz:'Osh', ru:'Плов', en:'Pilaf', porsiya:300, kkal:210, oqsil:8, yog:11, uglevod:22, rasm:true, sana:'2026-02-02', kat:'Ikkinchi taom' },
  { id:2, uz:'Somsa', ru:'Самса', en:'Samsa', porsiya:150, kkal:312, oqsil:11, yog:19, uglevod:24, rasm:true, sana:'2026-02-02', kat:'Ikkinchi taom' },
  { id:3, uz:'Lagmon', ru:'Лагман', en:'Lagman', porsiya:400, kkal:214, oqsil:9, yog:8, uglevod:27, rasm:false, sana:'2026-03-15', kat:'Birinchi taom' },
  { id:4, uz:'Obi non', ru:'', en:'', porsiya:100, kkal:262, oqsil:8, yog:2, uglevod:52, rasm:false, sana:'2026-04-01', kat:'Non' },
  { id:5, uz:'Achichuk', ru:'Ачичук', en:'Achichuk salad', porsiya:120, kkal:38, oqsil:1, yog:1, uglevod:6, rasm:true, sana:'2026-04-18', kat:'Salat' },
];

/* Recipes live in ui_kits/shared/recipes.js — the same store the mobile app reads.
   Resolved defensively: that file is a plain script, so it is not part of the compiled
   design-system bundle. Each kit page loads it before this one. */
const RECIPES = (typeof RECIPE_DB !== 'undefined' ? RECIPE_DB
  : (typeof window !== 'undefined' && window.RECIPE_DB) || []);

/* Requests live in `../shared/support.js` — the same store the mobile app's «Yordam» chat
   writes to, keyed by user id. Nothing about a conversation is defined here, so the two
   surfaces cannot drift apart. */
const foydalanuvchi = (id) => USERS.find(u => u.id === id) || null;

const REQ_HOLAT = ['yangi', "ko'rildi", 'yopildi'];

const LOG = [
  { sana:'2026-09-13 14:20', kim:'admin', amal:"PRO berildi — Kamola Tosheva", sabab:'kompensatsiya' },
  { sana:'2026-09-13 11:05', kim:'admin', amal:'Taklif tasdiqlandi — Toshkent oshi', sabab:'—' },
  { sana:'2026-09-12 18:44', kim:'admin', amal:'Foydalanuvchi bloklandi — Jasur Abdullayev', sabab:'spam' },
  { sana:'2026-09-12 09:30', kim:'admin', amal:"Narx o'zgardi — Oylik 29 000 → 34 000 so'm", sabab:'indeksatsiya' },
  { sana:'2026-09-11 16:12', kim:'admin', amal:'Retsept chop etildi — Tovuqli salat', sabab:'—' },
];

const PRICES = [
  { id:'oylik', nomi:'Oylik', narx:34000 },
  { id:'olti', nomi:'6 oylik', narx:169000 },
  { id:'yillik', nomi:'Yillik', narx:299000 },
];

const som = (n) => Number(n).toLocaleString('ru-RU').replace(/\u00A0/g,' ') + " so'm";
const son = (n) => Number(n).toLocaleString('en-US');

/* Admin-managed option lists. Categories were the first; rejection reasons and extension
   periods are the same shape, so one store serves all three rather than three copies of
   the same validation. Each list seeds from what the panel already uses — including the
   values existing rows carry — so nothing can be orphaned, then merges saved additions.

   Lists NOT here, deliberately: Murakkablik (Oson/O'rta/Qiyin is a fixed scale, a fourth
   value would mean nothing to the app), Tarif (the tariffs are the Narxlar rows — a new
   one is a priced product, created there, not typed into a dropdown), and the recipe
   filter (a filter lists what exists; inventing a value would filter to empty). */
const RO_KEY = 'nutrilife.admin.royxatlar';

const RO_SEED = {
  kategoriya: ['Birinchi taom','Ikkinchi taom','Non','Salat','Shirinlik','Ichimlik'],
  radSabab: ["Noto'g'ri ma'lumot",'Rasm tushunarsiz','Takroriy taklif','Spam'],
  muddat: ['1 oy','3 oy','6 oy','1 yil'],
};

// Values already carried by real rows, so an existing record never loses its option.
const RO_ISHLATILGAN = {
  kategoriya: () => [].concat(DISHES.map(d=>d.kat), RECIPES.map(r=>r.kat)),
  radSabab: () => [],
  muddat: () => [],
};

const roSaqlangan = () => {
  try { const v = JSON.parse(localStorage.getItem(RO_KEY) || '{}'); return v && typeof v === 'object' ? v : {}; }
  catch (e) { return {}; }
};

const royxat = (nom) => {
  const seen = new Set();
  return (RO_SEED[nom] || [])
    .concat((RO_ISHLATILGAN[nom] ? RO_ISHLATILGAN[nom]() : []).filter(Boolean))
    .concat(roSaqlangan()[nom] || [])
    .filter(k => { const key = String(k).trim().toLowerCase();
      if (!key || seen.has(key)) return false; seen.add(key); return true; });
};

// Returns null when accepted, or the reason it was refused.
const royxatQoshish = (nom, qiymat) => {
  const t = String(qiymat || '').trim();
  if (!t) return "Nom bo'sh bo'lmasin";
  if (royxat(nom).some(k => k.toLowerCase() === t.toLowerCase())) return 'Bu qiymat allaqachon bor';
  const all = roSaqlangan();
  all[nom] = (all[nom] || []).concat([t]);
  try { localStorage.setItem(RO_KEY, JSON.stringify(all)); } catch (e) {}
  return null;
};

// Kept as named wrappers: categories are referenced by name across the content screens.
const kategoriyalar = () => royxat('kategoriya');
const kategoriyaQoshish = (nom) => royxatQoshish('kategoriya', nom);

/* Per-day series for A10. The dashboard tiles state the CURRENT value of each metric;
   these are the daily readings behind them, so the last day of every series equals the
   tile and the period buttons re-read the same history at different depths rather than
   substituting different numbers.

   Values are generated once per metric from a fixed seed: a deterministic walk that ends
   on the published figure. Deterministic matters — a random series would change on every
   render and the chart would disagree with itself between the 7- and 30-day views. */
const METRIKA = [
  { key:'yangi',     label:'Yangi foydalanuvchilar', oxiri:52,    jami:son(1120),  seriya:1, birlik:'' },
  { key:'faol',      label:'Kunlik faol',            oxiri:1870,  jami:son(1870),  seriya:2, birlik:'' },
  { key:'skan',      label:'Skanlar soni',           oxiri:3510,  jami:son(28410), seriya:3, birlik:'' },
  { key:'pro',       label:'PRO obunachilar',        oxiri:312,   jami:'312',      seriya:4, birlik:'' },
  { key:'retention', label:'7-kun retention',        oxiri:38,    jami:'38%',      seriya:5, birlik:'%' },
];

const KUNLAR = ['yak','dush','sesh','chor','pay','jum','shan'];
const OYLAR = ['yan','fev','mar','apr','may','iyn','iyl','avg','sen','okt','noy','dek'];
const BUGUN = '2026-09-13';

// Mulberry-style integer hash — same input, same output, no Math.random anywhere.
const shovqin = (seed, i) => {
  let t = (seed * 9301 + i * 49297) % 233280;
  return t / 233280;
};

const metrikaSeriya = (m, days) => {
  const end = new Date(BUGUN + 'T00:00:00').getTime();
  // A gentle upward trend with day-of-week wobble, scaled to the metric's own magnitude.
  const amp = m.oxiri * (m.key === 'retention' ? 0.10 : 0.16);
  const growth = m.key === 'retention' ? 0.25 : 0.55;
  const out = [];
  for (let k = days - 1; k >= 0; k--) {
    const d = new Date(end - k * 86400000);
    const t = (days - 1 - k) / Math.max(1, days - 1);
    const base = m.oxiri * (1 - growth * (1 - t));
    const wobble = (shovqin(m.seriya * 31, days * 7 + (days - k)) - 0.5) * amp;
    const weekend = d.getDay() === 0 || d.getDay() === 6 ? -amp * 0.35 : 0;
    let v = base + wobble + weekend;
    if (k === 0) v = m.oxiri;
    out.push({
      iso: d.toISOString().slice(0, 10),
      kun: d.getDate(),
      oy: OYLAR[d.getMonth()],
      hafta: KUNLAR[d.getDay()],
      qiymat: m.key === 'retention' ? Math.round(v * 10) / 10 : Math.max(0, Math.round(v)),
    });
  }
  return out;
};

/* Revenue is derived, never stated. The ledger below is the single source: one row per
   settled payment, priced from PRICES so a price change flows through every total. All
   four figures on A10 (lifetime, per-month, last 7 days, today) are aggregations of this
   array — nothing is written as a total anywhere.

   Manual PRO grants are deliberately absent: the panel already tells admins that a
   hand-granted subscription does not enter revenue statistics (A3), so counting one here
   would contradict the product's own rule. Only manba:'tolov' exists in the ledger. */
const NARX = (nomi) => (PRICES.find(p => p.nomi === nomi) || {}).narx || 0;
const TARIFLAR = ['Oylik','6 oylik','Yillik'];

const PAYMENTS = (() => {
  const rows = [];
  const end = new Date(BUGUN + 'T00:00:00').getTime();
  // 260 days back covers this year to date, so the month chart has real depth.
  for (let k = 259; k >= 0; k--) {
    const d = new Date(end - k * 86400000);
    const t = (259 - k) / 259;
    // Payment count per day grows with the user base; the wobble is seeded, not random.
    const base = 0.6 + t * 2.4;
    const wob = shovqin(7, k * 3 + 11);
    // Floor at one payment a day: the product has paying users every day at this scale,
    // and a zero would read as a broken tile rather than a quiet day.
    const n = Math.max(1, Math.round(base + (wob - 0.5) * 2));
    for (let i = 0; i < n; i++) {
      const pickN = shovqin(13, k * 17 + i * 5);
      const tarif = pickN < 0.62 ? 'Oylik' : pickN < 0.86 ? '6 oylik' : 'Yillik';
      rows.push({ iso: d.toISOString().slice(0,10), tarif, summa: NARX(tarif), manba:'tolov' });
    }
  }
  return rows;
})();

const OY_NOM = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
// Explicit, because slicing three letters makes Iyun and Iyul both "Iyu".
const OY_QISQA = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];

const daromadJami = () => PAYMENTS.reduce((s,p)=>s+p.summa, 0);

const daromadBugun = () => PAYMENTS.filter(p=>p.iso === BUGUN).reduce((s,p)=>s+p.summa, 0);

// Last `days` calendar days ending today, including days with no payments (as zero).
const daromadKunlar = (days = 7) => {
  const end = new Date(BUGUN + 'T00:00:00').getTime();
  const out = [];
  for (let k = days - 1; k >= 0; k--) {
    const d = new Date(end - k * 86400000);
    const iso = d.toISOString().slice(0,10);
    out.push({
      iso,
      kun: d.getDate(),
      hafta: KUNLAR[d.getDay()],
      summa: PAYMENTS.filter(p=>p.iso === iso).reduce((s,p)=>s+p.summa, 0),
    });
  }
  return out;
};

const daromadOylar = () => {
  const byMonth = new Map();
  PAYMENTS.forEach(p => {
    const key = p.iso.slice(0,7);
    byMonth.set(key, (byMonth.get(key) || 0) + p.summa);
  });
  return [...byMonth.entries()].sort((a,b)=>a[0] < b[0] ? -1 : 1).map(([key,summa]) => ({
    key,
    oy: OY_NOM[Number(key.slice(5,7)) - 1],
    qisqa: OY_QISQA[Number(key.slice(5,7)) - 1],
    summa,
  }));
};

Object.assign(window, { SECTIONS, USERS, SUGGESTIONS, DISHES, RECIPES, foydalanuvchi, REQ_HOLAT, LOG, PRICES, som, son, METRIKA, metrikaSeriya, BUGUN, kategoriyalar, kategoriyaQoshish, royxat, royxatQoshish, RO_KEY, PAYMENTS, TARIFLAR, daromadJami, daromadBugun, daromadKunlar, daromadOylar, OY_NOM, OY_QISQA });
