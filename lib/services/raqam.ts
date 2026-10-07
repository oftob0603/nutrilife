// Raqamlarni ekranga chiqarish — sof yordamchi, bazaga bog'liq emas; klient va server
// komponentlar ham shu yerdan import qiladi.

/** Katta raqamlar uchun minglik ajratgich: 1085 -> "1,085". */
export function raqam(son: number): string {
  return Math.round(son).toLocaleString("en-US");
}
