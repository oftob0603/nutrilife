// Admin paneldan hisobni bloklash, blokni yechish va ma'lumotini o'chirish (S6 8-task,
// admin-tz.md A3). Har amal `admin_amallari` ga yoziladi (§4). Admin hisobiga nisbatan bu
// amallar bajarilmaydi — admin o'zini ham, boshqa adminni ham bloklay yoki o'chira olmaydi.

import { db } from "../db.ts";
import { tilniOqi } from "../lugat/tarjima.ts";
import {
  blokYechishTafsiloti,
  ochirishTafsiloti,
  tasdiqMosmi,
  type OchirishSorovi,
} from "./foydalanuvchi-admin-hisob.ts";
import type { OchirilganHisob } from "./foydalanuvchilar.ts";
import { rolniOqi } from "./huquqlar.ts";
import { ombordanOchir } from "./ombor.ts";

/** Prisma'ning "record not found" xatosi — o'chirmoqchi bo'lgan qator allaqachon yo'q. */
function yozuvYoqmi(xato: unknown): boolean {
  return typeof xato === "object" && xato !== null && "code" in xato && xato.code === "P2025";
}

/** "admin" — hisob admin, amal bajarilmaydi; "allaqachon" — holat so'ralganidek turibdi. */
export type BlokNatijasi = "ok" | "topilmadi" | "admin" | "allaqachon";

const HISOB_MAYDONLARI = { id: true, rol: true, bloklangan: true } as const;

/** Bloklash: `bloklangan` ga vaqt yoziladi — sessiya tekshiruvi (lib/services/sessiya.ts) shu ustunga qaraydi. */
export async function bloklash(
  adminId: string,
  foydalanuvchiId: string,
  sabab: string,
  hozir: Date = new Date(),
): Promise<BlokNatijasi> {
  const hisob = await db.foydalanuvchi.findUnique({ where: { id: foydalanuvchiId }, select: HISOB_MAYDONLARI });
  if (!hisob) return "topilmadi";
  if (rolniOqi(hisob.rol) === "admin") return "admin";
  if (hisob.bloklangan) return "allaqachon";

  await db.$transaction([
    db.foydalanuvchi.update({ where: { id: foydalanuvchiId }, data: { bloklangan: hozir } }),
    db.adminAmali.create({
      data: {
        adminId,
        foydalanuvchiId,
        tur: "bloklash",
        tafsilot: "Kirish yopildi",
        sabab,
        eski: { bloklangan: null },
        yangi: { bloklangan: hozir.toISOString() },
      },
    }),
  ]);
  return "ok";
}

/** Blokni yechish: `bloklangan` tozalanadi, foydalanuvchi keyingi ochishda kiradi. */
export async function blokniYechish(
  adminId: string,
  foydalanuvchiId: string,
  sabab: string,
): Promise<BlokNatijasi> {
  const hisob = await db.foydalanuvchi.findUnique({ where: { id: foydalanuvchiId }, select: HISOB_MAYDONLARI });
  if (!hisob) return "topilmadi";
  if (rolniOqi(hisob.rol) === "admin") return "admin";
  if (!hisob.bloklangan) return "allaqachon";

  await db.$transaction([
    db.foydalanuvchi.update({ where: { id: foydalanuvchiId }, data: { bloklangan: null } }),
    db.adminAmali.create({
      data: {
        adminId,
        foydalanuvchiId,
        tur: "blok_yechish",
        tafsilot: blokYechishTafsiloti(hisob.bloklangan),
        sabab,
        eski: { bloklangan: hisob.bloklangan.toISOString() },
        yangi: { bloklangan: null },
      },
    }),
  ]);
  return "ok";
}

export type OchirishNatijasi =
  | { natija: "topilmadi" | "admin" | "tasdiq" }
  | { natija: "ok"; hisob: OchirilganHisob };

/**
 * Ma'lumotini o'chirish — F5 dagi o'z-o'zini o'chirish bilan bir xil natija: qator o'chganda
 * profil, jurnal, rasmlar, obunalar kaskad bilan ketadi, so'ng R2 dagi rasmlar. Jurnal yozuvi
 * o'chirish bilan bitta tranzaksiyada: hisob o'chgach uning `foydalanuvchi_id` si bo'shaydi,
 * kim ekani tafsilotda qoladi. `tasdiq` kartadagi ism (ismsiz hisobda Telegram ID) bilan mos
 * kelmasa "tasdiq". Bot xabari uchun Telegram ID va til qaytariladi.
 */
export async function hisobniOchirishAdmin(
  adminId: string,
  foydalanuvchiId: string,
  { tasdiq, sabab }: OchirishSorovi,
): Promise<OchirishNatijasi> {
  const hisob = await db.foydalanuvchi.findUnique({
    where: { id: foydalanuvchiId },
    select: {
      rol: true,
      telegramId: true,
      til: true,
      bloklangan: true,
      yaratilgan: true,
      profil: { select: { ism: true } },
      rasmlar: { select: { kalit: true } },
    },
  });
  if (!hisob) return { natija: "topilmadi" };
  if (rolniOqi(hisob.rol) === "admin") return { natija: "admin" };

  const ism = hisob.profil?.ism ?? null;
  const telegramId = hisob.telegramId?.toString() ?? null;
  if (!tasdiqMosmi(tasdiq, ism, telegramId)) return { natija: "tasdiq" };

  try {
    await db.$transaction([
      db.adminAmali.create({
        data: {
          adminId,
          foydalanuvchiId,
          tur: "hisob_ochirish",
          tafsilot: ochirishTafsiloti(ism, telegramId),
          sabab,
          eski: {
            ism,
            telegramId,
            royxat: hisob.yaratilgan.toISOString(),
            bloklangan: hisob.bloklangan?.toISOString() ?? null,
          },
        },
      }),
      db.foydalanuvchi.delete({ where: { id: foydalanuvchiId } }),
    ]);
  } catch (xato) {
    // Qator biz o'qigandan keyin o'chib ketgan (P2025) — tranzaksiya qaytadi, jurnal ham yozilmaydi.
    if (yozuvYoqmi(xato)) return { natija: "topilmadi" };
    throw xato;
  }

  await Promise.allSettled(hisob.rasmlar.map((rasm) => ombordanOchir(rasm.kalit)));
  return { natija: "ok", hisob: { telegramId: hisob.telegramId, til: tilniOqi(hisob.til) } };
}
