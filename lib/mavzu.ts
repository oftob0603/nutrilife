// Mavzu tanlovi: yorug', qorong'i yoki tizim. Qiymatlar `foydalanuvchilar.mavzu` ustunidagi
// bilan bir xil — S3'da tanlov bazaga ham yoziladi, brauzer xotirasi esa tez ochilish
// uchun kesh bo'lib qoladi. Ranglarning o'zi app/globals.css da, <html data-mavzu> bo'yicha.
// "Tizim" Telegram ichida Telegram mavzusiga (<html data-tizim>), tashqarida OS'ga ergashadi.

import type { Kalit } from "./lugat/tarjima.ts";

export const MAVZULAR = ["yorug", "qorongi", "tizim"] as const;

export type Mavzu = (typeof MAVZULAR)[number];

/** Lug'at kalitlari — ekranda `t()` bilan tarjima qilinadi. */
export const MAVZU_NOMLARI: Record<Mavzu, Kalit> = {
  yorug: "Yorug'",
  qorongi: "Qorong'i",
  tizim: "Tizim",
};

export const MAVZU_KALITI = "nutrilife-mavzu";

/** Shu tabda tanlov o'zgarganini bildiradigan hodisa (`storage` faqat boshqa tablarga keladi). */
const OZGARDI = "nutrilife-mavzu-ozgardi";

/** Shu ochilishda ilova Telegram ichida ekani va Telegram mavzusi (sessionStorage). */
const TELEGRAM_KALITI = "nutrilife-telegram";
const TIZIM_KALITI = "nutrilife-tizim";

/**
 * <head> ichida, sahifa chizilishidan oldin ishlaydigan skript: saqlangan tanlovni
 * <html data-mavzu> ga qo'yadi — aks holda ochilishda tizim mavzusi lip etib ko'rinadi.
 * "tizim"da atribut qo'yilmaydi. Xotira yopiq bo'lsa (maxfiy rejim) jim o'tiladi.
 *
 * Telegram ilovani URL hash'ida `tgWebAppData` va `tgWebAppThemeParams` bilan ochadi: shundan
 * <html data-telegram> (o'z orqaga tugmalarimiz yashiriladi) va <html data-tizim> qo'yiladi.
 * Yorug'/qorong'i Telegram SDK'si kabi `bg_color` yorqinligidan aniqlanadi. Ilova ichida
 * yurganda hash yo'qoladi — qiymatlar shu ochilish davomida sessionStorage'da turadi.
 * Haqiqiy holatni SDK yuklangach `TelegramUlagich` tasdiqlaydi yoki olib tashlaydi.
 */
export const MAVZU_SKRIPTI = `(function(){var d=document.documentElement;try{var m=localStorage.getItem(${JSON.stringify(MAVZU_KALITI)});if(m==="yorug"||m==="qorongi")d.dataset.mavzu=m}catch(e){}try{var s=sessionStorage,h=new URLSearchParams(location.hash.slice(1)),p=h.get("tgWebAppThemeParams"),x=null;if(h.get("tgWebAppData"))s.setItem(${JSON.stringify(TELEGRAM_KALITI)},"1");if(p){var b=JSON.parse(p).bg_color;if(/^#[0-9a-f]{6}$/i.test(b)){var r=parseInt(b.slice(1,3),16),g=parseInt(b.slice(3,5),16),k=parseInt(b.slice(5,7),16);x=Math.sqrt(.299*r*r+.587*g*g+.114*k*k)<120?"qorongi":"yorug";s.setItem(${JSON.stringify(TIZIM_KALITI)},x)}}else x=s.getItem(${JSON.stringify(TIZIM_KALITI)});if(s.getItem(${JSON.stringify(TELEGRAM_KALITI)})==="1"){d.dataset.telegram="";if(x==="yorug"||x==="qorongi")d.dataset.tizim=x}}catch(e){}})()`;

function mavzumi(qiymat: unknown): qiymat is Mavzu {
  return (MAVZULAR as readonly unknown[]).includes(qiymat);
}

/** Saqlangan tanlov; yo'q, noto'g'ri yoki xotira yopiq bo'lsa — "tizim". */
export function mavzuniOqi(): Mavzu {
  try {
    const qiymat = localStorage.getItem(MAVZU_KALITI);
    return mavzumi(qiymat) ? qiymat : "tizim";
  } catch {
    return "tizim";
  }
}

function sahifagaQoy(mavzu: Mavzu) {
  if (mavzu === "tizim") delete document.documentElement.dataset.mavzu;
  else document.documentElement.dataset.mavzu = mavzu;
}

/** Tanlovni darhol qo'llaydi va eslab qoladi. Xotira yopiq bo'lsa tanlov shu sahifada qoladi. */
export function mavzuniTanla(mavzu: Mavzu) {
  sahifagaQoy(mavzu);
  try {
    if (mavzu === "tizim") localStorage.removeItem(MAVZU_KALITI);
    else localStorage.setItem(MAVZU_KALITI, mavzu);
  } catch {
    // Saqlanmadi — keyingi ochilishda tizim mavzusi bo'ladi.
  }
  window.dispatchEvent(new Event(OZGARDI));
}

/** `useSyncExternalStore` uchun obuna: shu tabdagi va boshqa tablardagi o'zgarish. */
export function mavzugaObuna(xabar: () => void): () => void {
  const boshqaTab = (hodisa: StorageEvent) => {
    if (hodisa.key !== null && hodisa.key !== MAVZU_KALITI) return;
    sahifagaQoy(mavzuniOqi());
    xabar();
  };
  window.addEventListener(OZGARDI, xabar);
  window.addEventListener("storage", boshqaTab);
  return () => {
    window.removeEventListener(OZGARDI, xabar);
    window.removeEventListener("storage", boshqaTab);
  };
}

const QORONGI_SOROVI = "(prefers-color-scheme: dark)";

/** "Tizim" hozir qorong'imi: Telegram ichida Telegram mavzusi, tashqarida OS. */
export function tizimQorongimi(): boolean {
  const tizim = document.documentElement.dataset.tizim;
  if (tizim) return tizim === "qorongi";
  return window.matchMedia(QORONGI_SOROVI).matches;
}

/** `useSyncExternalStore` uchun: OS yoki Telegram mavzusi o'zgarishi. */
export function tizimgaObuna(xabar: () => void): () => void {
  const sorov = window.matchMedia(QORONGI_SOROVI);
  sorov.addEventListener("change", xabar);
  window.addEventListener(OZGARDI, xabar);
  return () => {
    sorov.removeEventListener("change", xabar);
    window.removeEventListener(OZGARDI, xabar);
  };
}

/**
 * Telegram ichida ekanini <html data-telegram> ga yozadi (yoki olib tashlaydi) va "tizim"
 * mavzusini Telegram mavzusiga bog'laydi; null — Telegram'dan tashqari, "tizim" OS'ga qaytadi.
 */
export function telegramHolatiniQoy(sxema: "light" | "dark" | null) {
  const d = document.documentElement;
  if (sxema === null) {
    delete d.dataset.telegram;
    delete d.dataset.tizim;
  } else {
    d.dataset.telegram = "";
    d.dataset.tizim = sxema === "dark" ? "qorongi" : "yorug";
  }
  try {
    if (sxema === null) {
      sessionStorage.removeItem(TELEGRAM_KALITI);
      sessionStorage.removeItem(TIZIM_KALITI);
    } else {
      sessionStorage.setItem(TELEGRAM_KALITI, "1");
      sessionStorage.setItem(TIZIM_KALITI, d.dataset.tizim ?? "");
    }
  } catch {
    // Xotira yopiq — keyingi qayta yuklashda SDK baribir tasdiqlaydi.
  }
  window.dispatchEvent(new Event(OZGARDI));
}
