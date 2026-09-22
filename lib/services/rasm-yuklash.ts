// Rasmni brauzerda siqish va serverga yuborish. Faqat klient komponentlar ishlatadi —
// bazaga ham, omborga ham tegmaydi, hammasi POST /api/rasmlar orqali o'tadi.

import { k } from "../lugat/tarjima.ts";
import { apiSorov } from "./api-klient.ts";
import { RASM_CHEGARASI } from "./rasm-hisob.ts";

/**
 * Uzun tomoni shu o'lchamgacha kichraytiriladi. 2560 px va 90% sifatda rasm ko'z bilan
 * asldan farq qilmaydi, hajmi esa odatda 0,8–1,5 MB — jurnal og'irlashmaydi.
 */
const ENG_KATTA_TOMON = 2560;

/** Birinchisi odatdagi sifat; qolganlari faqat natija chegaradan oshsa sinaladi. */
const SIFAT_BOSQICHLARI = [0.9, 0.8, 0.65, 0.5];

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
    throw new Error(k("Bu rasmni o'qib bo'lmadi. Boshqa rasm tanlang"));
  }

  const nisbat = Math.min(1, ENG_KATTA_TOMON / Math.max(tasvir.width, tasvir.height));
  const tuval = document.createElement("canvas");
  tuval.width = Math.round(tasvir.width * nisbat);
  tuval.height = Math.round(tasvir.height * nisbat);
  tuval.getContext("2d")?.drawImage(tasvir, 0, 0, tuval.width, tuval.height);
  tasvir.close();

  for (const sifat of SIFAT_BOSQICHLARI) {
    const natija = await jpegga(tuval, sifat);
    if (natija && natija.size <= RASM_CHEGARASI) return natija;
  }
  throw new Error(k("Rasm juda katta. Boshqa rasm tanlang"));
}

// Oxirgi yuklangan rasmning telefondagi nusxasi: tahlil ekrani uni omborga imzoli havola
// orqali qayta so'ramasdan darhol ko'rsatadi — yuklash va tahlil orasida bo'sh joy miltillamaydi.
// Bittasi saqlanadi, yangisi kelganda eskisi bo'shatiladi.
let nusxa: { rasmId: string; manzil: string } | null = null;

/** Rasm ko'rsatiladigan manzil: shu seansda yuklangan bo'lsa telefondagi nusxa, aks holda API. */
export function rasmManzili(rasmId: string): string {
  return nusxa?.rasmId === rasmId ? nusxa.manzil : `/api/rasmlar/${rasmId}`;
}

/**
 * Rasmni siqib serverga yuboradi va `rasmlar` dagi ID ni qaytaradi. Xato bo'lsa
 * foydalanuvchiga ko'rsatiladigan o'zbekcha matn (lug'at kaliti) bilan Error tashlaydi — ekran
 * uni `erkin()` orqali tarjima qiladi. Rasm navbatga
 * olinmaydi: yuborilmasa, foydalanuvchi o'zi qayta urinadi (PRD.md, 8-bo'lim).
 */
export async function rasmniYukla(manba: Blob): Promise<string> {
  if (!navigator.onLine) {
    throw new Error(k("Internet yo'q. Ulanishni tekshiring"));
  }

  const siqilgan = await rasmniSiq(manba);
  const shakl = new FormData();
  shakl.append("rasm", siqilgan, "ovqat.jpg");

  let javob: Response;
  try {
    javob = await apiSorov("/api/rasmlar", { method: "POST", body: shakl });
  } catch {
    throw new Error(k("Yuklanmadi. Internetni tekshirib, qayta urinib ko'ring"));
  }

  const tana = (await javob.json().catch(() => null)) as
    | { rasm?: { id: string }; xato?: string }
    | null;
  if (!javob.ok || !tana?.rasm) {
    throw new Error(tana?.xato ?? k("Yuklanmadi. Qayta urinib ko'ring"));
  }
  if (nusxa) URL.revokeObjectURL(nusxa.manzil);
  nusxa = { rasmId: tana.rasm.id, manzil: URL.createObjectURL(siqilgan) };
  return tana.rasm.id;
}
