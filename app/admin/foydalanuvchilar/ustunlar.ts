import type { Ustun } from "../_components/AdminJadval";

/** A2 jadval ustunlari — prototip `screens-users.jsx` bilan bir xil enlar; sahifa va skelet bitta ro'yxatdan. */
export const USTUNLAR: readonly Ustun[] = [
  { kalit: "ism", nomi: "Ism", eni: "minmax(150px,1.6fr)" },
  { kalit: "telegramId", nomi: "Telegram ID", eni: "120px", raqam: true, xira: true },
  { kalit: "rol", nomi: "Rol", eni: "116px" },
  { kalit: "obuna", nomi: "Obuna", eni: "minmax(160px,1fr)" },
  { kalit: "royxat", nomi: "Ro'yxatdan", eni: "108px", raqam: true, xira: true },
  { kalit: "faollik", nomi: "Oxirgi faollik", eni: "116px", xira: true },
  { kalit: "skanlar", nomi: "Skanlar", eni: "84px", raqam: true, ong: true },
];
