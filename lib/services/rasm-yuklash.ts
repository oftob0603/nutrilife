// Rasmni brauzerda siqish va serverga yuborish. Faqat klient komponentlar ishlatadi —
// bazaga ham, omborga ham tegmaydi, hammasi POST /api/rasmlar orqali o'tadi.

import { RASM_CHEGARASI } from "./rasm-hisob.ts";

/** Uzun tomoni shu o'lchamgacha kichraytiriladi — AI tahlili uchun yetarli. */
const ENG_KATTA_TOMON = 1600;

function jpegga(tuval: HTMLCanvasElement, sifat: number): Promise<Blob | null> {
  return new Promise((hal) => tuval.toBlob(hal, "image/jpeg", sifat));
}

/**
 * Rasmni kichraytirib JPEG ga o'giradi. Telefon kamerasi 5–12 MB rasm beradi,
 * server esa RASM_CHEGARASI dan kattasini olmaydi — shuning uchun siqish majburiy qadam.
 */
export async function rasmniSiq(manba: Blob): Promise<Blob> {
  let tasvir: ImageBitmap;
  try {
    tasvir = await createImageBitmap(manba, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Bu rasmni o'qib bo'lmadi. Boshqa rasm tanlang");
  }

  const nisbat = Math.min(1, ENG_KATTA_TOMON / Math.max(tasvir.width, tasvir.height));
  const tuval = document.createElement("canvas");
  tuval.width = Math.round(tasvir.width * nisbat);
  tuval.height = Math.round(tasvir.height * nisbat);
  tuval.getContext("2d")?.drawImage(tasvir, 0, 0, tuval.width, tuval.height);
  tasvir.close();

  for (const sifat of [0.85, 0.7, 0.5]) {
    const natija = await jpegga(tuval, sifat);
    if (natija && natija.size <= RASM_CHEGARASI) return natija;
  }
  throw new Error("Rasm juda katta. Boshqa rasm tanlang");
}

/**
 * Rasmni siqib serverga yuboradi va `rasmlar` dagi ID ni qaytaradi. Xato bo'lsa
 * foydalanuvchiga ko'rsatiladigan o'zbekcha matn bilan Error tashlaydi. Rasm navbatga
 * olinmaydi: yuborilmasa, foydalanuvchi o'zi qayta urinadi (PRD.md, 8-bo'lim).
 */
export async function rasmniYukla(manba: Blob): Promise<string> {
  if (!navigator.onLine) {
    throw new Error("Internet yo'q. Ulanishni tekshiring");
  }

  const siqilgan = await rasmniSiq(manba);
  const shakl = new FormData();
  shakl.append("rasm", siqilgan, "ovqat.jpg");

  let javob: Response;
  try {
    javob = await fetch("/api/rasmlar", { method: "POST", body: shakl });
  } catch {
    throw new Error("Yuklanmadi. Internetni tekshirib, qayta urinib ko'ring");
  }

  const tana = (await javob.json().catch(() => null)) as
    | { rasm?: { id: string }; xato?: string }
    | null;
  if (!javob.ok || !tana?.rasm) {
    throw new Error(tana?.xato ?? "Yuklanmadi. Qayta urinib ko'ring");
  }
  return tana.rasm.id;
}
