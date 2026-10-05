import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** Widget ma'lumoti shu muddatdan eski bo'lsa qabul qilinmaydi — o'g'irlangan javob abadiy ishlamasin. */
const YAROQLILIK_SONIYA = 24 * 60 * 60;
/** Server va Telegram soatlari orasidagi farq uchun: `auth_date` shunchagacha "kelajakda" bo'lishi mumkin. */
const SOAT_FARQI_SONIYA = 5 * 60;

const HASH_QOLIPI = /^[0-9a-f]{64}$/;

export type LoginNatijasi =
  | { telegramId: bigint; ism: string | null }
  | { xato: "format" | "imzo" | "eskirgan" };

/**
 * Telegram Login Widget (brauzerdagi admin paneli, A0) bergan foydalanuvchi obyektini
 * tekshiradi: imzo bot tokeni bilan tasdiqlanadi (core.telegram.org/widgets/login —
 * "Checking authorization"), so'ng `auth_date` yangiligi ko'riladi. Mini App initData'dan
 * farqi — kalit `sha256(token)`, maydonlar esa JSON obyekt. Bazaga tegmaydi.
 */
export function loginMalumotiniTekshir(
  malumot: unknown,
  botToken: string,
  hozir: Date = new Date(),
): LoginNatijasi {
  if (typeof malumot !== "object" || malumot === null || Array.isArray(malumot)) {
    return { xato: "format" };
  }
  const maydonlar = malumot as Record<string, unknown>;
  const hash = maydonlar.hash;
  if (typeof hash !== "string" || !HASH_QOLIPI.test(hash)) return { xato: "format" };

  const juftlar: string[] = [];
  for (const kalit of Object.keys(maydonlar).sort()) {
    if (kalit === "hash") continue;
    const qiymat = maydonlar[kalit];
    if (typeof qiymat !== "string" && typeof qiymat !== "number") return { xato: "format" };
    juftlar.push(`${kalit}=${qiymat}`);
  }
  const maxfiyKalit = createHash("sha256").update(botToken).digest();
  const kutilgan = createHmac("sha256", maxfiyKalit).update(juftlar.join("\n")).digest();
  if (!timingSafeEqual(kutilgan, Buffer.from(hash, "hex"))) return { xato: "imzo" };

  const authDate = Number(maydonlar.auth_date);
  if (!Number.isInteger(authDate)) return { xato: "format" };
  const yoshi = Math.floor(hozir.getTime() / 1000) - authDate;
  if (yoshi > YAROQLILIK_SONIYA || yoshi < -SOAT_FARQI_SONIYA) return { xato: "eskirgan" };

  const id = Number(maydonlar.id);
  if (!Number.isSafeInteger(id) || id <= 0) return { xato: "format" };

  const ism =
    typeof maydonlar.first_name === "string"
      ? maydonlar.first_name.trim().slice(0, 40) || null
      : null;
  return { telegramId: BigInt(id), ism };
}
