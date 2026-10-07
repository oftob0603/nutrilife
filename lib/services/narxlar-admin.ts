// A12 — narxlarni admin paneldan o'zgartirish (admin-tz.md). Narx o'zgarishi mavjud obunalarga
// ta'sir qilmaydi: obuna qatori o'z `narx` suratini saqlaydi, bu yerda faqat `tariflar` yangilanadi.
// Har saqlash `admin_amallari` ga bitta `narx_ozgartirish` yozuvi (eski va yangi narxlar).

import { db } from "../db.ts";
import { tarifIdmi, type TarifNarxi } from "../tariflar.ts";
import { narxOzgarishlari, narxTafsiloti, type NarxSorovi } from "./narxlar-admin-hisob.ts";

// Uzoqdagi bazaga har so'rov ~0,4 s — standart tranzaksiya chegarasi yetmaydi (obuna-admin.ts kabi).
const TRANZAKSIYA_VAQTI = { maxWait: 10_000, timeout: 20_000 };

export type NarxNatijasi = "ok" | "ozgarish_yoq";

export async function narxlarniOzgartirish(
  adminId: string,
  sorov: NarxSorovi,
  hozir: Date = new Date(),
): Promise<NarxNatijasi> {
  return db.$transaction(async (tx) => {
    const qatorlar = await tx.tarifNarxi.findMany({ orderBy: { tartib: "asc" } });
    const eski: TarifNarxi[] = qatorlar
      .filter((q) => tarifIdmi(q.id))
      .map((q) => ({ id: q.id, narx: q.narx, oylar: q.oylar }) as TarifNarxi);
    const ozgarishlar = narxOzgarishlari(eski, sorov);
    if (ozgarishlar.length === 0) return "ozgarish_yoq";

    for (const o of ozgarishlar) {
      await tx.tarifNarxi.update({ where: { id: o.id }, data: { narx: o.yangi, yangilangan: hozir } });
    }
    await tx.adminAmali.create({
      data: {
        adminId,
        tur: "narx_ozgartirish",
        tafsilot: narxTafsiloti(ozgarishlar),
        // Narx o'zgartirishda sabab so'ralmaydi (admin-tz.md §4 — sabab PRO, bloklash, o'chirishda).
        sabab: "",
        eski: Object.fromEntries(ozgarishlar.map((o) => [o.id, o.eski])),
        yangi: Object.fromEntries(ozgarishlar.map((o) => [o.id, o.yangi])),
      },
    });
    return "ok";
  }, TRANZAKSIYA_VAQTI);
}
