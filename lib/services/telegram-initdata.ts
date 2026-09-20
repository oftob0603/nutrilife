import { createHmac, timingSafeEqual } from "node:crypto";

/** initData shu muddatdan eski bo'lsa qabul qilinmaydi — o'g'irlangan qator abadiy ishlamasin. */
const YAROQLILIK_SONIYA = 24 * 60 * 60;
/** Server va Telegram soatlari orasidagi farq uchun: `auth_date` shunchagacha "kelajakda" bo'lishi mumkin. */
const SOAT_FARQI_SONIYA = 5 * 60;

const HASH_QOLIPI = /^[0-9a-f]{64}$/;
const TILLAR = ["uz", "ru", "en"] as const;

export type Til = (typeof TILLAR)[number];

export type InitDataNatijasi =
  | { telegramId: bigint; til: Til }
  | { xato: "format" | "imzo" | "eskirgan" };

/**
 * Telegram Mini App bergan initData qatorini tekshiradi: imzo bot tokeni bilan
 * tasdiqlanadi (core.telegram.org/bots/webapps — "Validating data received via the
 * Mini App"), so'ng `auth_date` yangiligi ko'riladi. Bazaga tegmaydi.
 */
export function initDataniTekshir(
  initData: string,
  botToken: string,
  hozir: Date = new Date(),
): InitDataNatijasi {
  const maydonlar = new URLSearchParams(initData);
  const hash = maydonlar.get("hash");
  if (!hash || !HASH_QOLIPI.test(hash)) return { xato: "format" };
  maydonlar.delete("hash");

  const tekshiruvQatori = [...maydonlar.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([kalit, qiymat]) => `${kalit}=${qiymat}`)
    .join("\n");
  const maxfiyKalit = createHmac("sha256", "WebAppData").update(botToken).digest();
  const kutilgan = createHmac("sha256", maxfiyKalit).update(tekshiruvQatori).digest();
  if (!timingSafeEqual(kutilgan, Buffer.from(hash, "hex"))) return { xato: "imzo" };

  const authDate = Number(maydonlar.get("auth_date"));
  if (!Number.isInteger(authDate)) return { xato: "format" };
  const yoshi = Math.floor(hozir.getTime() / 1000) - authDate;
  if (yoshi > YAROQLILIK_SONIYA || yoshi < -SOAT_FARQI_SONIYA) return { xato: "eskirgan" };

  let user: { id?: unknown; language_code?: unknown };
  try {
    user = JSON.parse(maydonlar.get("user") ?? "");
  } catch {
    return { xato: "format" };
  }
  if (typeof user?.id !== "number" || !Number.isSafeInteger(user.id) || user.id <= 0) {
    return { xato: "format" };
  }

  const til = TILLAR.find((t) => t === user.language_code) ?? "uz";
  return { telegramId: BigInt(user.id), til };
}
