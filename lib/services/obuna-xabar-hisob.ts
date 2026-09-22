// Obuna muddati haqidagi bot xabarlari (S5 fon vazifalari) uchun sof hisob — bazaga bog'lanmagan.
// Har bosqich Toshkent kalendari bo'yicha aniq kun va soatda ketadi (foydalanuvchi jadvali,
// DECISIONS 2026-09-22): kun obuna tugaydigan sanadan sanaladi, shuning uchun matndagi "7 kundan
// keyin", "ertaga" doim to'g'ri. Server o'chiq bo'lib vaqt o'tib ketsa, 6 soat ichida kechikib
// ketadi; undan keyin bosqich tashlab ketiladi.

import { k, type Kalit } from "../lugat/tarjima.ts";
import { toshkentSanasi } from "./yozuv-hisob.ts";

const KUN_MS = 24 * 60 * 60 * 1000;
/** Belgilangan vaqtdan keyin shu muddat ichida kechikib yuborilishi mumkin. */
const KECHIKISH_MS = 6 * 60 * 60 * 1000;

/** Emoji kodda, matn lug'atda — tarjimada emoji yo'qolmaydi (bot.ts `salomXabari` kabi). */
type Qator = readonly [emoji: string, matn: Kalit];

type Bosqich = {
  /** `obunalar.xabar_bosqichi` ga yoziladigan raqam — bosqichlar faqat oldinga yuradi. */
  raqam: number;
  /** Obuna tugaydigan Toshkent sanasiga nisbatan kun (-7 — 7 kun oldin). */
  kun: number;
  /** Toshkent vaqti, "SS:DD". */
  soat: string;
  qatorlar: readonly Qator[];
  tugma: Qator;
  /** Tugma ochadigan ilova sahifasi. */
  sahifa: string;
};

/** Foydalanuvchi bergan matnlar va tugmalar (DECISIONS 2026-09-22). */
export const XABAR_BOSQICHLARI: readonly Bosqich[] = [
  {
    raqam: 1,
    kun: -7,
    soat: "12:23",
    qatorlar: [
      ["⏳", k("NutriLifer PRO obunangiz 7 kundan keyin tugaydi.")],
      ["✨", k("PRO imkoniyatlaringiz hali 7 kun davomida faol.")],
    ],
    tugma: ["📅", k("Obuna muddatini ko'rish")],
    // Profildagi obuna kartasi — "… gacha faol" muddati shu yerda.
    sahifa: "/profil",
  },
  {
    raqam: 2,
    kun: -3,
    soat: "18:32",
    qatorlar: [
      ["📊", k("PRO obunangiz tugashiga 3 kun qoldi.")],
      ["🤖", k("AI skanlar, Nutrition Score va batafsil statistika siz uchun hali faol.")],
    ],
    tugma: ["🔓", k("PRO imkoniyatlarini davom ettirish")],
    sahifa: "/pro?manba=profil",
  },
  {
    raqam: 3,
    kun: -1,
    soat: "19:31",
    qatorlar: [
      ["🔔", k("PRO obunangiz ertaga tugaydi.")],
      ["✨", k("PRO imkoniyatlaridan foydalanishni davom ettirish uchun obunani davom ettirishingiz mumkin.")],
    ],
    tugma: ["✨", k("Obunani davom ettirish")],
    sahifa: "/pro?manba=profil",
  },
  {
    raqam: 4,
    kun: 0,
    soat: "12:11",
    qatorlar: [
      ["🔒", k("NutriLifer PRO obunangiz tugadi.")],
      ["✨", k("PRO funksiyalarini qayta faollashtirishingiz mumkin.")],
    ],
    tugma: ["🔓", k("PRO ni qayta faollashtirish")],
    sahifa: "/pro?manba=profil",
  },
  {
    raqam: 5,
    kun: 2,
    soat: "18:37",
    qatorlar: [
      ["✨", k("NutriLifer PRO siz uchun yana mavjud.")],
      ["🚀", k("AI skan, Nutrition Score va boshqa PRO imkoniyatlarini qayta oching.")],
    ],
    tugma: ["✨", k("PRO ga qaytish")],
    sahifa: "/pro?manba=profil",
  },
];

/** Xabar va tugma matni tanlangan tilda; `t` — foydalanuvchi tilidagi tarjimon. */
export function bosqichMatni(
  bosqich: Bosqich,
  t: (kalit: Kalit) => string,
): { matn: string; tugma: string } {
  return {
    matn: bosqich.qatorlar.map(([emoji, kalit]) => `${emoji} ${t(kalit)}`).join("\n"),
    tugma: `${bosqich.tugma[0]} ${t(bosqich.tugma[1])}`,
  };
}

/** Bazadan nomzodlar: tugashi shu oraliqdagi obunalar (kunlarda, hozirga nisbatan). */
export const NOMZOD_OYNASI_KUN = { dan: -4, gacha: 8 } as const;

/** Toshkent sanasi "YYYY-MM-DD" ga `kun` qo'shib, shu kundagi `soat` lahzasi. */
function toshkentLahzasi(sana: string, kun: number, soat: string): Date {
  const kunBoshi = new Date(Date.parse(`${sana}T00:00:00Z`) + kun * KUN_MS).toISOString().slice(0, 10);
  return new Date(`${kunBoshi}T${soat}:00+05:00`);
}

/**
 * Bosqich yuboriladigan lahza. "Tugadi" — tugash lahzasidan keyingi birinchi belgilangan soat
 * (obuna kechqurun tugasa, xabar ertasi kuni); qolganlari tugash sanasidan sanaladi.
 */
export function bosqichLahzasi(bosqich: Bosqich, tugash: Date): Date {
  const lahza = toshkentLahzasi(toshkentSanasi(tugash), bosqich.kun, bosqich.soat);
  return bosqich.kun === 0 && lahza < tugash ? new Date(lahza.getTime() + KUN_MS) : lahza;
}

/**
 * Hozir yuborilishi kerak bo'lgan bosqich; `yuborilgan` dan keyingisi bo'lmasa null.
 * Vaqti kelgan (6 soatdan ko'p o'tmagan) eng so'nggi bosqich — o'tib ketganlari yuborilmaydi.
 */
export function navbatdagiBosqich(tugash: Date, hozir: Date, yuborilgan: number): Bosqich | null {
  const vaqti = XABAR_BOSQICHLARI.filter((bosqich) => {
    const farq = hozir.getTime() - bosqichLahzasi(bosqich, tugash).getTime();
    return farq >= 0 && farq < KECHIKISH_MS;
  }).at(-1);
  return vaqti && vaqti.raqam > yuborilgan ? vaqti : null;
}
