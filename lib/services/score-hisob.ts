// Nutrition Score — sof formula, bazaga va AI'ga bog'liq emas (DECISIONS 2026-09-13: AI
// baholamaydi). Ball yeyilganning MUVOZANATINI baholaydi, kun qanchalik to'lganini emas —
// yarim kun yomon kun emas, shuning uchun ball kunning istalgan soatida ma'noli bo'lishi kerak.
// Axborot xarakterida, tibbiy baho emas.

import { k, type Kalit } from "../lugat/tarjima.ts";
import type { Reja } from "./norma-hisob.ts";
import type { Jami } from "./yozuv-hisob.ts";

/** Makro ulushi maqsaddan nisbatan shuncha og'sa — 0 ball. */
const ULUSH_OGISHI = 0.6;
/** Kaloriya normadan shuncha oshsa — 0 ball. Normadan past bo'lish jazolanmaydi: kun tugamagan. */
const NORMA_OSHISHI = 0.25;

const VAZNLAR = { oqsil: 0.3, yog: 0.2, uglevod: 0.2, norma: 0.3 } as const;

export type ScoreQismi = { nomi: Kalit; qiymat: number };

export type Score = {
  /** 0–100. */
  ball: number;
  daraja: Kalit;
  /** Oqsil, yog', uglevod ulushi va "norma ichida" — har biri 0–100. */
  qismlar: ScoreQismi[];
  /** Eng past qismning nomi. */
  engPast: Kalit;
};

/** API javobidagi ko'rinishi: PRO'da ball (yoki hali yo'q), qolganlarga yopiq — son yuborilmaydi. */
export type ScoreJavobi = { yopiq: true } | { yopiq: false; natija: Score | null };

function chegarala(qiymat: number): number {
  return Math.max(0, Math.min(100, Math.round(qiymat)));
}

/** Maqsadda — 100; ulush maqsaddan nisbatan `ULUSH_OGISHI` ga og'ganda — 0. */
function ulushBali(amalda: number, maqsad: number): number {
  return chegarala((1 - Math.abs(amalda - maqsad) / maqsad / ULUSH_OGISHI) * 100);
}

export function scoreDarajasi(ball: number): Kalit {
  return ball >= 80 ? k("Yaxshi") : ball >= 55 ? k("O'rtacha") : k("Past");
}

/**
 * Kun jami va shu kun rejasidan ball. Yozuv yo'q, makrolar kiritilmagan yoki reja yaroqsiz
 * bo'lsa null — ekranda 0 emas, "ball kutilmoqda" ko'rinadi.
 */
export function nutritionScore(jami: Jami, reja: Reja): Score | null {
  // Ulushlar makrolardan kelgan kaloriya bo'yicha: miqyosga bog'liq emas, kun o'rtasida ham to'g'ri.
  const yeyilgan = jami.oqsil * 4 + jami.yog * 9 + jami.uglevod * 4;
  const rejada = reja.oqsil * 4 + reja.yog * 9 + reja.uglevod * 4;
  if (!(yeyilgan > 0) || !(reja.kaloriya > 0)) return null;
  if (!(reja.oqsil > 0) || !(reja.yog > 0) || !(reja.uglevod > 0)) return null;

  const oqsil = ulushBali((jami.oqsil * 4) / yeyilgan, (reja.oqsil * 4) / rejada);
  const yog = ulushBali((jami.yog * 9) / yeyilgan, (reja.yog * 9) / rejada);
  const uglevod = ulushBali((jami.uglevod * 4) / yeyilgan, (reja.uglevod * 4) / rejada);

  const oshgan = Math.max(0, jami.kaloriya - reja.kaloriya) / reja.kaloriya;
  const norma = chegarala((1 - oshgan / NORMA_OSHISHI) * 100);

  const ball = Math.round(
    oqsil * VAZNLAR.oqsil + yog * VAZNLAR.yog + uglevod * VAZNLAR.uglevod + norma * VAZNLAR.norma,
  );
  const qismlar: ScoreQismi[] = [
    { nomi: k("Oqsil ulushi"), qiymat: oqsil },
    { nomi: k("Yog' ulushi"), qiymat: yog },
    { nomi: k("Uglevod ulushi"), qiymat: uglevod },
    { nomi: k("Norma ichida"), qiymat: norma },
  ];
  // Teng bo'lsa ro'yxatdagi birinchisi — tartib barqaror.
  const engPast = qismlar.reduce((past, qism) => (qism.qiymat < past.qiymat ? qism : past));

  return { ball, daraja: scoreDarajasi(ball), qismlar, engPast: engPast.nomi };
}
