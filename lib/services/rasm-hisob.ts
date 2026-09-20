// Rasm bilan bog'liq sof qoidalar — bazaga va omborga bog'liq emas, shuning uchun
// klient komponentlar ham shu yerdan import qiladi.

/**
 * Yuklanadigan rasmning eng katta hajmi, MB da. Vercel funksiyasi 4,5 MB dan katta
 * so'rov tanasini qabul qilmaydi — chegara shundan oshirilmaydi.
 */
export const RASM_CHEGARASI_MB = 4;
export const RASM_CHEGARASI = RASM_CHEGARASI_MB * 1024 * 1024;

export type RasmTuri = "image/jpeg" | "image/png" | "image/webp";

const KENGAYTMA: Record<RasmTuri, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function rasmKengaytmasi(tur: RasmTuri): string {
  return KENGAYTMA[tur];
}

/**
 * Fayl turini mazmunining bosh baytlaridan aniqlaydi. Fayl nomi va brauzer aytgan
 * turga ishonilmaydi — nomi `.jpg` ga o'zgartirilgan boshqa fayl o'tmasligi kerak.
 */
export function rasmTuri(baytlar: Uint8Array): RasmTuri | null {
  const boshi = (...kutilgan: number[]) =>
    kutilgan.every((bayt, i) => baytlar[i] === bayt);

  if (boshi(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (boshi(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  // RIFF....WEBP
  if (
    boshi(0x52, 0x49, 0x46, 0x46) &&
    baytlar[8] === 0x57 &&
    baytlar[9] === 0x45 &&
    baytlar[10] === 0x42 &&
    baytlar[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}
