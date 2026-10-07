import type { Ustun } from "../_components/AdminJadval";

/** A6 jadval ustunlari — prototip `screens-content.jsx` A6 enlari; sahifa va skelet bitta ro'yxatdan. */
export const USTUNLAR: readonly Ustun[] = [
  { kalit: "uz", nomi: "O'zbekcha", eni: "minmax(140px,1.2fr)" },
  { kalit: "ru", nomi: "Ruscha", eni: "minmax(120px,1.2fr)" },
  { kalit: "en", nomi: "Inglizcha", eni: "minmax(120px,1.2fr)" },
  { kalit: "olchov", nomi: "O'lchov", eni: "92px", raqam: true, ong: true },
  { kalit: "kkal", nomi: "kkal", eni: "80px", raqam: true, ong: true },
  { kalit: "makro", nomi: "Makrolar", eni: "132px", raqam: true, xira: true },
  { kalit: "rasm", nomi: "Rasm", eni: "64px" },
  { kalit: "sana", nomi: "Qo'shilgan", eni: "112px", raqam: true, xira: true },
];
