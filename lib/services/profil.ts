import { db } from "../db.ts";
import { obunaHolati, rolniOqi } from "./huquqlar.ts";
import { ilovadaKun, type Profil } from "./profil-hisob.ts";

/** Profil ekrani (F1) uchun hisob egasining ma'lumoti; hisob topilmasa null. */
export async function profilniOl(foydalanuvchiId: string): Promise<Profil | null> {
  const foydalanuvchi = await db.foydalanuvchi.findUnique({
    where: { id: foydalanuvchiId },
    select: {
      avatarUrl: true,
      birliklar: true,
      rol: true,
      yaratilgan: true,
      obunalar: { select: { boshlanish: true, tugash: true } },
      profil: { select: { ism: true, maqsad: true } },
      // Joriy vazn — eng oxirgi o'lchov; maqsad vazn ham o'sha yozuvda turadi.
      vaznYozuvlari: { orderBy: { vaqt: "desc" }, take: 1, select: { vazn: true, maqsad: true } },
    },
  });
  if (!foydalanuvchi) return null;

  const obuna = obunaHolati(foydalanuvchi.obunalar);
  const vazn = foydalanuvchi.vaznYozuvlari[0] ?? null;
  return {
    ism: foydalanuvchi.profil?.ism ?? null,
    avatarUrl: foydalanuvchi.avatarUrl,
    ilovadaKun: ilovadaKun(foydalanuvchi.yaratilgan),
    rol: rolniOqi(foydalanuvchi.rol),
    obuna: { holat: obuna.holat, tugash: obuna.tugash?.toISOString() ?? null },
    maqsad: foydalanuvchi.profil?.maqsad ?? null,
    joriyVazn: vazn?.vazn ?? null,
    maqsadVazn: vazn?.maqsad ?? null,
    birliklar: foydalanuvchi.birliklar,
  };
}
