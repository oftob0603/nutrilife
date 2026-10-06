import type { Ustun } from "../_components/AdminJadval";

/** A4 jadval ustunlari — prototip `screens-queue.jsx` bilan bir xil enlar; sahifa va skelet bitta ro'yxatdan. */
export const USTUNLAR: readonly Ustun[] = [
  { kalit: "rasm", nomi: "Rasm", eni: "72px" },
  { kalit: "ai", nomi: "AI nima degan", eni: "minmax(0,1.4fr)", xira: true },
  { kalit: "tuzatish", nomi: "Foydalanuvchi tuzatishi", eni: "minmax(0,1.4fr)" },
  { kalit: "kim", nomi: "Kim yuborgan", eni: "minmax(0,1fr)", xira: true },
  { kalit: "sana", nomi: "Sana", eni: "120px", raqam: true, xira: true },
  { kalit: "holat", nomi: "Holat", eni: "150px" },
];
