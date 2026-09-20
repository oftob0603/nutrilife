import { AwsClient } from "aws4fetch";

// Rasm ombori — Cloudflare R2 (DECISIONS.md, 2026-09-20). R2 S3-mos API bilan
// ishlaydi, har so'rov maxfiy kalit bilan imzolanadi. Bucket yopiq: rasm faqat
// muddati cheklangan imzoli havola orqali o'qiladi.

/** Imzoli havola shu muddatdan keyin ishlamaydi. */
export const HAVOLA_MUDDATI_SONIYA = 3600;

type Sozlama = { klient: AwsClient; asos: string };

let sozlama: Sozlama | undefined;

function ombor(): Sozlama {
  if (sozlama) return sozlama;

  const hisob = process.env.R2_ACCOUNT_ID;
  const kalitId = process.env.R2_ACCESS_KEY_ID;
  const sir = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  if (!hisob || !kalitId || !sir || !bucket) {
    throw new Error("R2 sozlanmagan: R2_* o'zgaruvchilari .env'da to'liq emas");
  }

  sozlama = {
    klient: new AwsClient({
      accessKeyId: kalitId,
      secretAccessKey: sir,
      service: "s3",
      region: "auto",
    }),
    asos: `https://${hisob}.r2.cloudflarestorage.com/${bucket}`,
  };
  return sozlama;
}

function manzil(kalit: string): string {
  return `${ombor().asos}/${kalit.split("/").map(encodeURIComponent).join("/")}`;
}

/** Faylni omborga yozadi; ombor rad etsa xato tashlaydi. */
export async function omborgaYoz(
  kalit: string,
  tana: Uint8Array<ArrayBuffer>,
  mime: string,
): Promise<void> {
  // Avval so'rov tanasiz imzolanadi, tana esa keyin baytlar sifatida qo'shiladi.
  // Tana imzolagich orqali o'tsa oqimga aylanadi va Content-Length yuborilmaydi —
  // R2 bunday so'rovni 411 bilan rad etadi. S3'da tana imzoga kirmaydi
  // (UNSIGNED-PAYLOAD), shuning uchun imzo o'z kuchida qoladi.
  const imzolangan = await ombor().klient.sign(manzil(kalit), {
    method: "PUT",
    headers: { "Content-Type": mime },
  });
  const javob = await fetch(imzolangan.url, {
    method: "PUT",
    headers: imzolangan.headers,
    body: tana,
  });
  if (!javob.ok) throw new Error(`Ombor yozishni rad etdi: ${javob.status}`);
}

/** Ombordagi faylni o'chiradi — baza yozuvi yaratilmay qolgan rasmni tozalash uchun. */
export async function ombordanOchir(kalit: string): Promise<void> {
  await ombor().klient.fetch(manzil(kalit), { method: "DELETE" });
}

/** Faylni o'qish uchun muddati cheklangan imzoli havola. */
export async function oqishHavolasi(kalit: string): Promise<string> {
  const imzolangan = await ombor().klient.sign(
    `${manzil(kalit)}?X-Amz-Expires=${HAVOLA_MUDDATI_SONIYA}`,
    { method: "GET", aws: { signQuery: true } },
  );
  return imzolangan.url;
}
