// Mavzu tanlovi: yorug', qorong'i yoki tizim. Qiymatlar `foydalanuvchilar.mavzu` ustunidagi
// bilan bir xil — S3'da tanlov bazaga ham yoziladi, brauzer xotirasi esa tez ochilish
// uchun kesh bo'lib qoladi. Ranglarning o'zi app/globals.css da, <html data-mavzu> bo'yicha.

export const MAVZULAR = ["yorug", "qorongi", "tizim"] as const;

export type Mavzu = (typeof MAVZULAR)[number];

export const MAVZU_NOMLARI: Record<Mavzu, string> = {
  yorug: "Yorug'",
  qorongi: "Qorong'i",
  tizim: "Tizim",
};

export const MAVZU_KALITI = "nutrilife-mavzu";

/** Shu tabda tanlov o'zgarganini bildiradigan hodisa (`storage` faqat boshqa tablarga keladi). */
const OZGARDI = "nutrilife-mavzu-ozgardi";

/**
 * <head> ichida, sahifa chizilishidan oldin ishlaydigan skript: saqlangan tanlovni
 * <html data-mavzu> ga qo'yadi — aks holda ochilishda tizim mavzusi lip etib ko'rinadi.
 * "tizim"da atribut qo'yilmaydi. Xotira yopiq bo'lsa (maxfiy rejim) jim o'tiladi.
 */
export const MAVZU_SKRIPTI = `(function(){try{var m=localStorage.getItem(${JSON.stringify(MAVZU_KALITI)});if(m==="yorug"||m==="qorongi")document.documentElement.dataset.mavzu=m}catch(e){}})()`;

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
