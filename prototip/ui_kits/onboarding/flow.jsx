/* Onboarding option sets and the O6 field validation.

   The daily-target formula (normaHisobi), the goal/gender/activity tables it keys on,
   maqsadMuddati, tmi and fmt now live in ../shared/plan.js — the app and the prototype
   need the same formula, and the two copies had already drifted (two different `fmt`,
   one rounding and one not). This file keeps only what is specific to the questionnaire. */

const PREFS = ["Cheklov yo'q","Vegetarian","Go'shtni kam yeyman","Laktoza yo'q","Glyuten yo'q","Shakarni cheklayman"];
const MOTIVES = ["Sog'lig'im","Tashqi ko'rinishim","Ko'proq energiya","Shifokor tavsiyasi","Sport natijasi"];
const MEALS_PER_DAY = ['2','3','4 va undan ko\'p'];
const EAT_WHERE = ['Uyda','Ishda yoki tashqarida','Aralash'];

// §2 O6 — three separate checks, each belonging to one field.
function olchovTekshiruvi({ goal, height, weight, target }) {
  const h = Number(height), w = Number(weight), t = Number(target);
  const needTarget = goal !== 'saqlash' && goal !== '';
  const hOk = h >= 120 && h <= 230, wOk = w >= 30 && w <= 300, tOk = t >= 30 && t <= 300;
  const r = { needTarget, hOk, wOk, tOk, blocked: false };

  r.heightError = height && !hOk ? "Bo'y 120–230 sm oralig'ida bo'lsin" : undefined;
  r.weightError = weight && !wOk ? "Vazn 30–300 kg oralig'ida bo'lsin" : undefined;
  r.targetError = needTarget && target && !tOk ? "Vazn 30–300 kg oralig'ida bo'lsin" : undefined;

  // 1. Direction — blocks.
  if (needTarget && tOk && wOk && !r.targetError) {
    if ((goal === 'yoqotish') && t > w)
      r.targetError = "Vazn tashlashni tanlagansiz, lekin maqsad vazn joriysidan katta";
    else if ((goal === 'oshirish' || goal === 'mushak') && t < w)
      r.targetError = "Vazn ortdirishni tanlagansiz, lekin maqsad vazn joriysidan kichik";
  }
  r.direction = Boolean(r.targetError) && tOk && wOk;

  // Near-identical weights — advisory, does not block.
  if (needTarget && tOk && wOk && !r.targetError && Math.abs(t - w) < 1)
    r.nearGoal = "Bu maqsad joriy vaznga juda yaqin — 'Vaznni saqlash' to'g'riroq bo'lishi mumkin";

  // 2. Joriy vazn carries NO advisory. The user's self-reported weight is accepted as
  // given; only empty / non-numeric / out-of-range values are flagged (r.weightError).

  // 2b. 'Vaznni saqlash' has no separate target field, so its reminder judges the
  // CURRENT weight against height. One direction only, nothing inside the band, and
  // rendered as inline helper text under Joriy vazn. Never blocks.
  if (goal === 'saqlash' && hOk && wOk) {
    const b = tmi(w, h);
    if (b < 18.5) r.saqlashEslatma = "Bu vazn bo'yingizga nisbatan pastroq bo'lishi mumkin. Bu tibbiy maslahat emas!";
    else if (b > 25) r.saqlashEslatma = "Bu vazn bo'yingizga nisbatan yuqoriroq bo'lishi mumkin. Bu tibbiy maslahat emas!";
  }

  // 3. Target safety — advisory, under the target field. Direction follows the goal, so
  // "pastroq" and "yuqoriroq" can never appear together. Same 18.5 / 25 BMI band as
  // every other height-to-weight judgement in the app.
  if (needTarget && hOk && tOk && wOk && !r.targetError) {
    const b = tmi(t, h);
    if (goal === 'yoqotish' && b < 18.5)
      r.targetSafety = "Bu maqsad vazni bo'yingizga nisbatan pastroq bo'lishi mumkin. Bu tibbiy maslahat emas!";
    else if ((goal === 'oshirish' || goal === 'mushak') && b > 25)
      r.targetSafety = "Bu maqsad vazni bo'yingizga nisbatan yuqoriroq bo'lishi mumkin. Bu tibbiy maslahat emas!";
  }

  r.blocked = !hOk || !wOk || (needTarget && (!tOk || r.direction));
  return r;
}

Object.assign(window, { PREFS, MOTIVES, MEALS_PER_DAY, EAT_WHERE, olchovTekshiruvi });
