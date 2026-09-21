import { after } from "next/server";
import { AiXatosi } from "@/lib/services/ai";
import { hodisaYoz } from "@/lib/services/hodisalar";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { skanQil } from "@/lib/services/skan";
import { skanLimitiHolati, type LimitSababi } from "@/lib/services/skan-hisobi";
import { MATN_CHEGARASI, VAZN_CHEGARASI } from "@/lib/services/skan-hisob";
import { sorovTili } from "@/lib/lugat/server";
import { k } from "@/lib/lugat/tarjima";

// AI javobi 30 soniyagacha kutiladi — funksiya undan oldin uzilmasin.
export const maxDuration = 60;

// Ekranda ko'rinadi — klient lug'at orqali tarjima qiladi.
const LIMIT_XABARLARI: Record<LimitSababi | "kun", string> = {
  skan: k("Bepul skanlar tugadi. Taomni qo'lda qo'shish cheklovsiz"),
  kun: k("Bugungi skanlar ishlatildi. Ertaga yangilanadi — qo'lda qo'shish cheklovsiz"),
  tanilmagan: k(
    "Bugun taom bir necha marta tanilmadi. Ertaga yana urinib ko'ring yoki taomni qo'lda qo'shing",
  ),
  texnik: k("Bugungi AI skanlar tugadi. Taomni qo'lda qo'shish cheklovsiz"),
};

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Skan limiti va undan qolgani — E2 hisoblagichi va F1 obuna kartasi uchun. */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  const limit = foydalanuvchiId ? await skanLimitiHolati(foydalanuvchiId) : null;
  return limit ? Response.json({ limit }) : kirishKerak();
}

/**
 * AI skan: `{ rasmId }` yoki `{ matn }` (ikkalasi birga ham bo'ladi — matn rasmga izoh),
 * ixtiyoriy `vaznGramm`. Javob: `{ holat: "tayyor", natija }` yoki `{ holat: "tanib_bolmadi" }`;
 * limit tugagan bo'lsa 429 va `{ xato, kod: "limit", sabab, limit }`.
 */
export async function POST(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  let tana: Record<string, unknown>;
  try {
    tana = (await sorov.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  const rasmId = typeof tana.rasmId === "string" ? tana.rasmId : undefined;
  const matn = typeof tana.matn === "string" ? tana.matn.trim() : "";
  if (!rasmId && !matn) {
    return Response.json({ xato: "Rasm yoki matn kerak" }, { status: 400 });
  }
  if (rasmId && !UUID_QOLIPI.test(rasmId)) {
    return Response.json({ xato: "Rasm topilmadi" }, { status: 404 });
  }
  if (matn.length > MATN_CHEGARASI) {
    return Response.json(
      { xato: `Matn ${MATN_CHEGARASI} belgidan uzun` },
      { status: 400 },
    );
  }

  let vaznGramm: number | null = null;
  if (tana.vaznGramm !== undefined && tana.vaznGramm !== null) {
    const vazn = Number(tana.vaznGramm);
    if (!Number.isFinite(vazn) || vazn <= 0 || vazn > VAZN_CHEGARASI) {
      return Response.json({ xato: "Vazn noto'g'ri" }, { status: 400 });
    }
    vaznGramm = vazn;
  }

  try {
    const javob = await skanQil(foydalanuvchiId, {
      rasmId,
      matn: matn || undefined,
      vaznGramm,
      til: sorovTili(sorov),
    });
    if (javob.holat === "rasm_yoq") {
      return Response.json({ xato: "Rasm topilmadi" }, { status: 404 });
    }
    if (javob.holat === "hisob_yoq") return kirishKerak();
    if (javob.holat === "limit") {
      const { sabab, limit } = javob;
      const xabar = sabab === "skan" && limit.davr === "kun" ? "kun" : sabab;
      return Response.json(
        { xato: LIMIT_XABARLARI[xabar], kod: "limit", sabab, limit },
        { status: 429 },
      );
    }
    // "Tanib bo'lmadi" ham urinish — AI chaqirildi. Takroriy skanlarda hodisa qayta yozilmaydi.
    after(() => hodisaYoz(foydalanuvchiId, "birinchi_skan"));
    return Response.json(javob);
  } catch (xato) {
    console.error("Skan bajarilmadi:", xato instanceof Error ? xato.message : xato);
    const vaqtTugadi = xato instanceof AiXatosi && xato.tur === "vaqt_tugadi";
    return Response.json(
      { xato: "Tahlil qilib bo'lmadi. Qayta urinib ko'ring" },
      { status: vaqtTugadi ? 504 : 502 },
    );
  }
}
