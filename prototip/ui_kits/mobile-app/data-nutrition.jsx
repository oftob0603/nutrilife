// Nutrition computation for the PRO features. Every number on screen comes from these
// functions — nothing is a hardcoded display string. All of them return `null` when
// there is not enough data, so a screen hides the block instead of showing a fake value.

// --- Multi-day journal -------------------------------------------------------------
// Sample seed data (like FOODS, WEIGHTS and START_ENTRIES), but the nutrition values
// are DERIVED from the FOODS table rather than typed in, so a change to a food's
// calories flows through every historical day, every average and every report.

const DAY_GAPS = [3, 4, 11, 12, 20];          // days with nothing logged
const LUNCH  = ['osh', 'lagman', 'chuchvara', 'norin', 'shurpa'];
const DINNER = ['shurpa', 'norin', 'osh', 'manti', 'lagman'];
const SNACK  = [null, 'somsa', null, 'manti', null, 'somsa'];

// `grams` is the intended portion by weight. Foods priced per unit (manti, somsa, non)
// are converted to a whole number of units instead — passing grams to them is what
// produced impossible 60,000 kcal days.
function entryFrom(id, grams, meal, time, ai) {
  const f = FOODS.find((x) => x.id === id);
  if (!f) return null;
  const qty = f.per === 100 ? grams : Math.max(1, Math.round(grams / 120));
  const mult = f.per === 100 ? qty / 100 : qty;
  return {
    food: f.name,
    portion: f.per === 100 ? qty + ' g' : qty + ' ' + f.unit,
    time, meal, ai: Boolean(ai),
    kcal: Math.round(f.kcal * mult),
    p: f.p * mult, fat: f.fat * mult, c: f.c * mult,
  };
}

function buildHistory(todayIso, days) {
  const out = [];
  const base = new Date(todayIso + 'T00:00:00');
  for (let back = days - 1; back >= 0; back--) {
    const d = new Date(base);
    d.setDate(d.getDate() - back);
    const iso = d.toISOString().slice(0, 10);
    const i = days - 1 - back;                 // 0 = oldest
    if (DAY_GAPS.includes(i)) { out.push({ iso, entries: [] }); continue; }
    // Portion sizes swing deterministically day to day, so averages are not flat.
    const swing = [1, 1.2, 0.85, 1.1, 0.95, 1.3, 0.9][i % 7];
    const items = [
      entryFrom('non', i % 3 === 0 ? 120 : 240, 'Nonushta', '08:20'),
      entryFrom(LUNCH[i % LUNCH.length], Math.round(420 * swing / 10) * 10, 'Tushlik', '13:05', i % 2 === 0),
      entryFrom(DINNER[i % DINNER.length], Math.round(450 * swing / 10) * 10, 'Kechki', '19:30'),
    ];
    const snack = SNACK[i % SNACK.length];
    if (snack) items.push(entryFrom(snack, 130, 'Gazak', '16:40', true));
    out.push({ iso, entries: items.filter(Boolean).map((e, k) => ({ ...e, id: iso + '-' + k })) });
  }
  return out;
}

const HISTORY = buildHistory('2026-09-15', 30);

// Today's live entries always win over the seeded day, so the journal the user edits is
// the same data the statistics read.
function historyWith(today, todayEntries) {
  return HISTORY.map((d) => (d.iso === today ? { ...d, entries: todayEntries } : d));
}

// --- Day arithmetic ---------------------------------------------------------------
function dayTotals(entries) {
  return (entries || []).reduce(
    (s, e) => ({ kcal: s.kcal + e.kcal, p: s.p + e.p, fat: s.fat + e.fat, c: s.c + e.c }),
    { kcal: 0, p: 0, fat: 0, c: 0 }
  );
}

// --- 1. Nutrition Score -----------------------------------------------------------
// Scores the BALANCE of what has been eaten, not how much of the day is done — a
// half-finished day is not a bad day, so the score must be meaningful at any hour.
//
//   three macro components: how close each macro's share of calories is to its
//                           target share (scale-invariant, so valid mid-day)
//   calorie component:      100 while at or under the target, falling away only
//                           once the day goes OVER it
//
// No entries -> null, so the screen says the score is waiting rather than showing 0.
function nutritionScore(entries, goals) {
  if (!entries || entries.length === 0) return null;
  const tot = dayTotals(entries);
  const eaten = tot.p * 4 + tot.fat * 9 + tot.c * 4;
  if (eaten <= 0) return null;

  // Target shares derived from the goal macros, not typed in.
  const goalKcal = goals.p * 4 + goals.fat * 9 + goals.c * 4;
  const targetShare = { p: (goals.p * 4) / goalKcal, fat: (goals.fat * 9) / goalKcal, c: (goals.c * 4) / goalKcal };
  const actualShare = { p: (tot.p * 4) / eaten, fat: (tot.fat * 9) / eaten, c: (tot.c * 4) / eaten };

  // 100 on target; zero once the share is a full 60% away from it, relatively.
  const shareScore = (actual, target) => {
    const dev = Math.abs(actual - target) / target;
    return Math.max(0, Math.min(100, Math.round((1 - dev / 0.6) * 100)));
  };
  const prot = shareScore(actualShare.p, targetShare.p);
  const fat = shareScore(actualShare.fat, targetShare.fat);
  const carb = shareScore(actualShare.c, targetShare.c);

  // Being under the target is not penalised — the day may not be over.
  const overBy = Math.max(0, tot.kcal - goals.kcal) / goals.kcal;
  const kcal = Math.max(0, Math.min(100, Math.round((1 - overBy / 0.25) * 100)));

  const score = Math.round(prot * 0.3 + fat * 0.2 + carb * 0.2 + kcal * 0.3);
  const parts = [
    { label: t('Oqsil ulushi'), value: prot },
    { label: t("Yog' ulushi"), value: fat },
    { label: t('Uglevod ulushi'), value: carb },
    { label:t('Norma ichida'), value: kcal },
  ];
  const weakest = parts.slice().sort((a, b) => a.value - b.value)[0];
  return {
    score, parts, weakest,
    band: score >= 80 ? t('Yaxshi') : score >= 55 ? t("O'rtacha") : t('Past'),
  };
}

// --- 2. Smart portion advice ------------------------------------------------------
// The portion of THIS food that fits the calories left today — capped at a portion a
// person would actually eat. Without the cap, a large remaining allowance produces
// advice like "710 g of osh", which fits the arithmetic and no real plate.
// The ceiling is the food's own largest standard portion, since that is the product's
// existing statement of a big-but-normal serving.
function portionAdvice(food, remainingKcal) {
  if (!food || remainingKcal == null || remainingKcal <= 0) return null;
  const perUnit = food.per === 100 ? food.kcal / 100 : food.kcal;
  if (!perUnit) return null;
  const raw = remainingKcal / perUnit;
  const fits = food.per === 100 ? Math.floor(raw / 10) * 10 : Math.floor(raw);
  if (fits <= 0) return null;
  const ceiling = Math.max.apply(null, food.portions);
  const qty = Math.min(fits, ceiling);
  const mult = food.per === 100 ? qty / 100 : qty;
  return {
    qty,
    label: tPorsiya(food.per === 100 ? qty + ' g' : qty + ' ' + food.unit),
    kcal: Math.round(food.kcal * mult),
    remainingKcal,
    // True when the allowance would have permitted more than a normal serving — the
    // limit is the plate, not the budget, and the caption says so.
    capped: fits > ceiling,
  };
}

// --- 4. Meal suggestion that fits the remaining calories --------------------------
// Picks from the real food table: the standard portion whose calories come closest to
// filling what is left without exceeding it.
function mealSuggestion(remainingKcal) {
  if (remainingKcal == null || remainingKcal < 80) return null;
  let best = null;
  FOODS.forEach((f) => {
    f.portions.forEach((qty) => {
      const mult = f.per === 100 ? qty / 100 : qty;
      const kcal = Math.round(f.kcal * mult);
      if (kcal > remainingKcal) return;
      if (!best || kcal > best.kcal) {
        best = {
          food: f, qty, kcal,
          label: tPorsiya(f.per === 100 ? qty + ' g' : qty + ' ' + f.unit),
          p: f.p * mult, fat: f.fat * mult, c: f.c * mult,
        };
      }
    });
  });
  return best;
}

// --- 7. Detailed statistics -------------------------------------------------------
// Aggregates over the tracked days in a window. Untracked days are excluded from
// averages (a day with nothing logged is missing data, not a zero-calorie day).
function detailedStats(history, goals, windowDays) {
  const window = history.slice(-windowDays);
  const logged = window.filter((d) => d.entries.length > 0);
  if (logged.length < 2) return null;
  const totals = logged.map((d) => ({ iso: d.iso, ...dayTotals(d.entries) }));
  const avg = (k) => totals.reduce((s, x) => s + x[k], 0) / totals.length;
  const avgKcal = avg('kcal');
  const withinGoal = totals.filter((x) => Math.abs(x.kcal - goals.kcal) <= goals.kcal * 0.1).length;
  const over = totals.filter((x) => x.kcal > goals.kcal).length;
  const macroKcal = avg('p') * 4 + avg('fat') * 9 + avg('c') * 4;
  const share = (v) => (macroKcal ? Math.round((v / macroKcal) * 100) : 0);
  const sorted = totals.slice().sort((a, b) => a.kcal - b.kcal);
  const scores = logged.map((d) => nutritionScore(d.entries, goals)).filter(Boolean);
  return {
    days: logged.length,
    windowDays,
    avgKcal: Math.round(avgKcal),
    avgProtein: Math.round(avg('p')),
    avgFat: Math.round(avg('fat')),
    avgCarb: Math.round(avg('c')),
    split: { p: share(avg('p') * 4), fat: share(avg('fat') * 9), c: share(avg('c') * 4) },
    withinGoal, over,
    lowest: sorted[0],
    highest: sorted[sorted.length - 1],
    avgScore: scores.length ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : null,
    trackedShare: Math.round((logged.length / window.length) * 100),
  };
}

// --- 9. Weekly report -------------------------------------------------------------
// Last 7 days against the 7 before them. Needs at least 3 logged days in the current
// week, otherwise there is nothing worth reporting and the caller hides the block.
function weekReport(history, goals) {
  if (history.length < 8) return null;
  const cur = history.slice(-7);
  const prev = history.slice(-14, -7);
  const loggedCur = cur.filter((d) => d.entries.length > 0);
  if (loggedCur.length < 3) return null;
  const mean = (days, k) => {
    const l = days.filter((d) => d.entries.length > 0);
    if (!l.length) return null;
    return l.reduce((s, d) => s + dayTotals(d.entries)[k], 0) / l.length;
  };
  const curKcal = mean(cur, 'kcal');
  const prevKcal = mean(prev, 'kcal');
  const scores = loggedCur.map((d) => nutritionScore(d.entries, goals)).filter(Boolean);
  const byDay = cur.map((d) => ({
    iso: d.iso,
    kcal: d.entries.length ? dayTotals(d.entries).kcal : null,
  }));
  return {
    days: loggedCur.length,
    avgKcal: Math.round(curKcal),
    prevAvgKcal: prevKcal == null ? null : Math.round(prevKcal),
    deltaKcal: prevKcal == null ? null : Math.round(curKcal - prevKcal),
    avgProtein: Math.round(mean(cur, 'p')),
    goalKcal: goals.kcal,
    withinGoal: cur.filter((d) => d.entries.length &&
      Math.abs(dayTotals(d.entries).kcal - goals.kcal) <= goals.kcal * 0.1).length,
    avgScore: scores.length ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : null,
    byDay,
  };
}

const WEEKDAYS = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
const weekdayOf = (iso) => t(WEEKDAYS[new Date(iso + 'T00:00:00').getDay()]);

Object.assign(window, {
  HISTORY, historyWith, dayTotals, nutritionScore, portionAdvice,
  mealSuggestion, detailedStats, weekReport, weekdayOf, entryFrom,
});
