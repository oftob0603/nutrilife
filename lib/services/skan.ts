import { aiTahlil } from "./ai.ts";
import { rasmMazmuni } from "./rasmlar.ts";
import { skanJavobiniTekshir, type SkanJavobi } from "./skan-hisob.ts";
import { skanBandQil, skanQaytar } from "./skan-hisobi.ts";

export type SkanKirish = {
  rasmId?: string;
  matn?: string;
  vaznGramm?: number | null;
};

export type SkanNatijasi = SkanJavobi | { holat: "rasm_yoq" } | { holat: "limit" };

/**
 * Rasm yoki matnni AI'ga tahlil qildiradi. Jurnalga hech narsa yozmaydi — natija
 * foydalanuvchi tasdiqlagandan keyingina tushadi (DECISIONS 2026-09-13).
 * AI ishlamasa `AiXatosi` tashlaydi.
 */
export async function skanQil(
  foydalanuvchiId: string,
  { rasmId, matn, vaznGramm = null }: SkanKirish,
): Promise<SkanNatijasi> {
  let rasm;
  if (rasmId) {
    rasm = await rasmMazmuni(foydalanuvchiId, rasmId);
    if (!rasm) return { holat: "rasm_yoq" };
  }

  if (!(await skanBandQil(foydalanuvchiId))) return { holat: "limit" };

  try {
    const xom = await aiTahlil({ rasm, matn, vaznGramm });
    // "Tanib bo'lmadi" ham hisobga kiradi — AI chaqirildi va xarajat bo'ldi.
    return skanJavobiniTekshir(xom, vaznGramm);
  } catch (xato) {
    await skanQaytar(foydalanuvchiId).catch(() => {});
    throw xato;
  }
}
