// Klient komponentlardan o'z API'mizga so'rov. Faqat brauzerda ishlaydi — bazaga tegmaydi.

import { webApp } from "@/lib/telegram";

const SAQLASH_KALITI = "nutrilife-initdata";

/** Qayta kirish ham yordam bermadi — `KirishDarvozasi` "Ilovani qayta oching" pardasini ko'rsatadi. */
export const SESSIYA_TUGADI_HODISASI = "nutrilife:sessiya-tugadi";

/**
 * initData avval Telegram SDK'sidan olinadi. SDK yuklanmagan bo'lsa — URL hash'idan
 * (`#tgWebAppData=...`, Telegram ilovani shunday ochadi); ilova ichida yurganda hash
 * yo'qoladi, shuning uchun qiymat shu ochilish davomida saqlab turiladi.
 */
export function initDataniOl(): string | null {
  const sdkdagi = webApp()?.initData;
  const hashdagi =
    sdkdagi || new URLSearchParams(window.location.hash.slice(1)).get("tgWebAppData");
  try {
    if (hashdagi) {
      window.sessionStorage.setItem(SAQLASH_KALITI, hashdagi);
      return hashdagi;
    }
    return window.sessionStorage.getItem(SAQLASH_KALITI);
  } catch {
    // Xotira yopiq bo'lishi mumkin — hash'dagi qiymatning o'zi yetadi.
    return hashdagi;
  }
}

/** initData bilan kirish: muvaffaqiyatli javob sessiya cookie'sini yangilaydi. */
export function initDataBilanKirish(initData: string): Promise<Response> {
  return fetch("/api/auth/telegram", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ initData }),
  });
}

// Bir vaqtda bir nechta so'rov 401 olsa ham qayta kirish bitta bo'ladi.
let qaytaKirish: Promise<boolean> | null = null;

function jimginaQaytaKir(): Promise<boolean> {
  qaytaKirish ??= (async () => {
    const initData = initDataniOl();
    if (!initData) return false;
    try {
      return (await initDataBilanKirish(initData)).ok;
    } catch {
      return false;
    }
  })().finally(() => {
    qaytaKirish = null;
  });
  return qaytaKirish;
}

/**
 * `fetch` o'rnida ishlatiladi. Sessiya ish o'rtasida tugagan bo'lsa (401) bir marta jimgina
 * qayta kiradi va so'rovni takrorlaydi; bu ham yordam bermasa 401 javobining o'zi qaytadi
 * va parda ochiladi. Tana qayta yuboriladi, shuning uchun u oqim (stream) bo'lmasligi kerak.
 */
export async function apiSorov(yol: string, sozlama?: RequestInit): Promise<Response> {
  const javob = await fetch(yol, sozlama);
  if (javob.status !== 401) return javob;

  const takror = (await jimginaQaytaKir()) ? await fetch(yol, sozlama) : javob;
  if (takror.status === 401) window.dispatchEvent(new Event(SESSIYA_TUGADI_HODISASI));
  return takror;
}
