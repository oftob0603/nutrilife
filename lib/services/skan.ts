import type { Til } from "../lugat/tarjima.ts";
import { aiTahlil } from "./ai.ts";
import { rasmMazmuni } from "./rasmlar.ts";
import { skanJavobiniTekshir, type SkanJavobi } from "./skan-hisob.ts";
import type { SkanQoldigi } from "./huquqlar.ts";
import { skanBandQil, skanQaytar, type LimitSababi } from "./skan-hisobi.ts";

export type SkanKirish = {
  rasmId?: string;
  matn?: string;
  vaznGramm?: number | null;
  /** Taom nomi shu tilda qaytadi. */
  til?: Til;
};

export type SkanNatijasi =
  | SkanJavobi
  | { holat: "rasm_yoq" }
  | { holat: "hisob_yoq" }
  | { holat: "limit"; sabab: LimitSababi; limit: SkanQoldigi };

/**
 * Rasm yoki matnni AI'ga tahlil qildiradi. Jurnalga hech narsa yozmaydi — natija
 * foydalanuvchi tasdiqlagandan keyingina tushadi (DECISIONS 2026-09-13).
 * Rasm, galereya va matnli tasvir — bitta limit: hammasida AI ishlaydi. Limitdan faqat
 * tanilgan taom yeyiladi; tanilmagan urinish qaytariladi va alohida sanaladi.
 * AI ishlamasa `AiXatosi` tashlaydi.
 */
export async function skanQil(
  foydalanuvchiId: string,
  { rasmId, matn, vaznGramm = null, til }: SkanKirish,
): Promise<SkanNatijasi> {
  let rasm;
  if (rasmId) {
    rasm = await rasmMazmuni(foydalanuvchiId, rasmId);
    if (!rasm) return { holat: "rasm_yoq" };
  }

  const band = await skanBandQil(foydalanuvchiId);
  if (!band) return { holat: "hisob_yoq" };
  if (!band.band) return { holat: "limit", sabab: band.sabab, limit: band.limit };

  try {
    const xom = await aiTahlil({ rasm, matn, vaznGramm, til });
    const javob = skanJavobiniTekshir(xom, vaznGramm);
    if (javob.holat === "tanib_bolmadi") {
      await skanQaytar(foydalanuvchiId, band.sana, { tanilmagan: true }).catch(() => {});
    }
    return javob;
  } catch (xato) {
    await skanQaytar(foydalanuvchiId, band.sana).catch(() => {});
    throw xato;
  }
}
