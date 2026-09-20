import { randomUUID } from "node:crypto";
import { db } from "../db.ts";
import { omborgaYoz, ombordanOchir, ombordanOqi, oqishHavolasi } from "./ombor.ts";
import { S1_FOYDALANUVCHI } from "./ovqat-yozuvlari.ts";
import { rasmKengaytmasi, type RasmTuri } from "./rasm-hisob.ts";

export type Rasm = { id: string };

/** Ombordagi kalit: `ovqat/<foydalanuvchi>/<yil>/<oy>/<uuid>.<kengaytma>`. */
function yangiKalit(tur: RasmTuri): string {
  const hozir = new Date();
  const yil = hozir.getUTCFullYear();
  const oy = String(hozir.getUTCMonth() + 1).padStart(2, "0");
  return `ovqat/${S1_FOYDALANUVCHI}/${yil}/${oy}/${randomUUID()}.${rasmKengaytmasi(tur)}`;
}

/**
 * Rasmni omborga yozadi va `rasmlar` jadvaliga bog'laydi. Bazada faylning o'zi emas,
 * faqat ombordagi kaliti turadi. Yozuvga bog'lanish tasdiqdan keyin bo'ladi.
 */
export async function rasmSaqlash(
  baytlar: Uint8Array<ArrayBuffer>,
  tur: RasmTuri,
): Promise<Rasm> {
  const kalit = yangiKalit(tur);
  await omborgaYoz(kalit, baytlar, tur);

  try {
    return await db.rasm.create({
      data: {
        foydalanuvchiId: S1_FOYDALANUVCHI,
        kalit,
        mime: tur,
        hajm: baytlar.byteLength,
      },
      select: { id: true },
    });
  } catch (xato) {
    // Baza yozuvi bo'lmasa fayl egasiz qoladi — omborda qoldirmaymiz.
    await ombordanOchir(kalit).catch(() => {});
    throw xato;
  }
}

/** Rasm baytlari va turi — AI tahlili uchun; rasm topilmasa null. */
export async function rasmMazmuni(
  id: string,
): Promise<{ baytlar: Uint8Array; mime: RasmTuri } | null> {
  const rasm = await db.rasm.findFirst({
    where: { id, foydalanuvchiId: S1_FOYDALANUVCHI },
    select: { kalit: true, mime: true },
  });
  if (!rasm) return null;
  return { baytlar: await ombordanOqi(rasm.kalit), mime: rasm.mime as RasmTuri };
}

/**
 * Yozuvga bog'lanmagan rasmni ombordan va bazadan o'chiradi — foydalanuvchi tahlilni
 * bekor qilganda egasiz qolmasin. Jurnalga tushgan rasm o'chirilmaydi ("boglangan").
 */
export async function rasmOchirish(id: string): Promise<"ochirildi" | "yoq" | "boglangan"> {
  const rasm = await db.rasm.findFirst({
    where: { id, foydalanuvchiId: S1_FOYDALANUVCHI },
    select: { kalit: true, ovqatYozuviId: true },
  });
  if (!rasm) return "yoq";
  if (rasm.ovqatYozuviId) return "boglangan";

  // Shart qayta tekshiriladi: o'qish va o'chirish orasida rasm yozuvga bog'lanib qolishi mumkin.
  const { count } = await db.rasm.deleteMany({ where: { id, ovqatYozuviId: null } });
  if (count === 0) return "boglangan";

  // Ombor o'chira olmasa fayl qolib ketadi, lekin baza toza — davriy tozalash yig'ib oladi.
  await ombordanOchir(rasm.kalit).catch(() => {});
  return "ochirildi";
}

/** Rasmni o'qish uchun vaqtinchalik havola; rasm topilmasa null. */
export async function rasmHavolasi(id: string): Promise<string | null> {
  const rasm = await db.rasm.findFirst({
    where: { id, foydalanuvchiId: S1_FOYDALANUVCHI },
    select: { kalit: true },
  });
  return rasm ? oqishHavolasi(rasm.kalit) : null;
}
