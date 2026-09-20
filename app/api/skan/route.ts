import { AiXatosi } from "@/lib/services/ai";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";
import { skanQil } from "@/lib/services/skan";
import { MATN_CHEGARASI, VAZN_CHEGARASI } from "@/lib/services/skan-hisob";

// AI javobi 30 soniyagacha kutiladi — funksiya undan oldin uzilmasin.
export const maxDuration = 60;

const UUID_QOLIPI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * AI skan: `{ rasmId }` yoki `{ matn }` (ikkalasi birga ham bo'ladi — matn rasmga izoh),
 * ixtiyoriy `vaznGramm`. Javob: `{ holat: "tayyor", natija }` yoki `{ holat: "tanib_bolmadi" }`.
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
    const javob = await skanQil(foydalanuvchiId, { rasmId, matn: matn || undefined, vaznGramm });
    if (javob.holat === "rasm_yoq") {
      return Response.json({ xato: "Rasm topilmadi" }, { status: 404 });
    }
    if (javob.holat === "limit") {
      return Response.json(
        {
          xato: "Bugungi AI skanlar tugadi. Taomni qo'lda qo'shish cheklovsiz",
          kod: "limit",
        },
        { status: 429 },
      );
    }
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
