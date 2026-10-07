import type { Ustun } from "../_components/AdminJadval";

/** A8 jadval ustunlari — prototip `screens-content.jsx` A8 enlari; sahifa va skelet bitta ro'yxatdan. */
export const USTUNLAR: readonly Ustun[] = [
  { kalit: "nomi", nomi: "Nomi", eni: "minmax(160px,2fr)" },
  { kalit: "kategoriya", nomi: "Kategoriya", eni: "minmax(0,1.2fr)", xira: true },
  { kalit: "kkal", nomi: "kkal", eni: "80px", raqam: true, ong: true },
  { kalit: "vaqt", nomi: "Vaqt", eni: "90px", raqam: true, ong: true },
  { kalit: "murakkablik", nomi: "Murakkablik", eni: "110px", xira: true },
  { kalit: "mazmun", nomi: "Mazmuni", eni: "170px", xira: true },
  { kalit: "holat", nomi: "Holat", eni: "130px" },
];
