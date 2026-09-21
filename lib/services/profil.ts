import { db } from "../db.ts";
import { obunaHolati, rolniOqi } from "./huquqlar.ts";
import { odatniOqi } from "./onboarding-hisob.ts";
import { ilovadaKun, type Profil } from "./profil-hisob.ts";
import { rejaniYangilash } from "./rejalar.ts";
import type { ShaxsiyMalumot } from "./shaxsiy-hisob.ts";
import { sozlamalarniOqi } from "./sozlamalar-hisob.ts";

/** Profil ekrani (F1) uchun hisob egasining ma'lumoti; hisob topilmasa null. */
export async function profilniOl(foydalanuvchiId: string): Promise<Profil | null> {
  const foydalanuvchi = await db.foydalanuvchi.findUnique({
    where: { id: foydalanuvchiId },
    select: {
      avatarUrl: true,
      til: true,
      mavzu: true,
      vaznBirligi: true,
      boyBirligi: true,
      rol: true,
      yaratilgan: true,
      obunalar: { select: { boshlanish: true, tugash: true } },
      profil: true,
      // Joriy vazn — eng oxirgi o'lchov; maqsad vazn ham o'sha yozuvda turadi.
      vaznYozuvlari: { orderBy: { vaqt: "desc" }, take: 1, select: { vazn: true, maqsad: true } },
      rejalar: { orderBy: { hisoblangan: "desc" }, take: 1, select: { kaloriya: true } },
    },
  });
  if (!foydalanuvchi) return null;

  const { profil } = foydalanuvchi;
  const obuna = obunaHolati(foydalanuvchi.obunalar);
  const vazn = foydalanuvchi.vaznYozuvlari[0] ?? null;
  return {
    ism: profil?.ism ?? null,
    avatarUrl: foydalanuvchi.avatarUrl,
    ilovadaKun: ilovadaKun(foydalanuvchi.yaratilgan),
    rol: rolniOqi(foydalanuvchi.rol),
    obuna: { holat: obuna.holat, tugash: obuna.tugash?.toISOString() ?? null },
    maqsad: profil?.maqsad ?? null,
    joriyVazn: vazn?.vazn ?? null,
    maqsadVazn: vazn?.maqsad ?? null,
    norma: foydalanuvchi.rejalar[0]?.kaloriya ?? null,
    sozlamalar: sozlamalarniOqi(foydalanuvchi),
    jins: profil?.jins ?? null,
    yosh: profil?.yosh ?? null,
    boyi: profil?.boyi ?? null,
    faollik: profil?.faollik ?? null,
    ovqatAfzalliklari: profil?.ovqatAfzalliklari ?? [],
    ovqatlanishOdati: odatniOqi(profil?.ovqatlanishOdati),
  };
}

/** Oxirgi o'lchovdagi vazn (kg) — maqsad vazn yo'nalishi shunga nisbatan tekshiriladi. */
export async function joriyVazn(foydalanuvchiId: string): Promise<number | null> {
  const yozuv = await db.vaznYozuvi.findFirst({
    where: { foydalanuvchiId },
    orderBy: { vaqt: "desc" },
    select: { vazn: true },
  });
  return yozuv?.vazn ?? null;
}

/**
 * Shaxsiy ma'lumotni (F3) saqlaydi. Maqsad vazn `vazn_yozuvlari` ning oxirgi qatorida turadi —
 * yangi o'lchov yaratilmaydi, aks holda grafikda soxta nuqta paydo bo'lardi.
 */
export async function shaxsiyniSaqlash(
  foydalanuvchiId: string,
  { maqsadVazn, ovqatAfzalliklari, ovqatlanishOdati, ...malumot }: ShaxsiyMalumot,
): Promise<void> {
  const profil = {
    ...malumot,
    ...(ovqatAfzalliklari ? { ovqatAfzalliklari } : {}),
    ...(ovqatlanishOdati ? { ovqatlanishOdati } : {}),
  };
  const oxirgi = await db.vaznYozuvi.findFirst({
    where: { foydalanuvchiId },
    orderBy: { vaqt: "desc" },
    select: { id: true },
  });

  await db.$transaction([
    db.profil.upsert({
      where: { foydalanuvchiId },
      create: { foydalanuvchiId, ...profil },
      update: profil,
    }),
    ...(oxirgi
      ? [db.vaznYozuvi.update({ where: { id: oxirgi.id }, data: { maqsad: maqsadVazn } })]
      : []),
  ]);
  // Jins, yosh, bo'y, maqsad yoki faollik o'zgargan bo'lsa norma ham o'zgaradi.
  await rejaniYangilash(foydalanuvchiId);
}
