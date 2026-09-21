import { db } from "../db.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { normaHisobi, type Reja } from "./norma-hisob.ts";
import { sanaOraligi } from "./yozuv-hisob.ts";

const REJA_MAYDONLARI = { kaloriya: true, oqsil: true, yog: true, uglevod: true } as const;

// Uzoqdagi bazaga har so'rov ~0,4 s — standart chegara (2 s kutish, 5 s ish) yetmaydi.
const TRANZAKSIYA_VAQTI = { maxWait: 10_000, timeout: 20_000 };

/**
 * Normani profil va oxirgi vazndan qayta hisoblaydi. Natija oxirgi rejadan farq qilsagina
 * yangi qator yoziladi — eski qatorlar o'zgarmaydi, o'tgan kun o'sha kundagi norma bilan
 * qoladi (profil-tz.md, F3). Amaldagi rejani qaytaradi; javoblar to'liq bo'lmasa null.
 * Chaqiruvchi o'z tranzaksiyasini bersa shuning ichida, bermasa alohida tranzaksiyada ishlaydi.
 */
export function rejaniYangilash(
  foydalanuvchiId: string,
  klient?: Prisma.TransactionClient,
): Promise<Reja | null> {
  return klient
    ? qulfOstidaYangilash(foydalanuvchiId, klient)
    : db.$transaction((tx) => qulfOstidaYangilash(foydalanuvchiId, tx), TRANZAKSIYA_VAQTI);
}

async function qulfOstidaYangilash(
  foydalanuvchiId: string,
  klient: Prisma.TransactionClient,
): Promise<Reja | null> {
  // Hisob bo'yicha qulf, tranzaksiya oxirigacha: parallel so'rovlar "oxirgi reja"ni bir vaqtda
  // o'qib, bir xil qatorni ikki marta yozib qo'ymaydi — keyingisi oldingisi yozganini ko'radi.
  await klient.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${foydalanuvchiId}))`;

  const foydalanuvchi = await klient.foydalanuvchi.findUnique({
    where: { id: foydalanuvchiId },
    select: {
      profil: { select: { jins: true, yosh: true, boyi: true, faollik: true, maqsad: true } },
      vaznYozuvlari: { orderBy: { vaqt: "desc" }, take: 1, select: { vazn: true } },
      rejalar: { orderBy: { hisoblangan: "desc" }, take: 1, select: REJA_MAYDONLARI },
    },
  });
  const profil = foydalanuvchi?.profil;
  if (!foydalanuvchi || !profil) return null;

  const norma = normaHisobi({ ...profil, vazn: foydalanuvchi.vaznYozuvlari[0]?.vazn ?? null });
  if (!norma) return null;

  const yangi: Reja = { kaloriya: norma.kaloriya, ...norma.makrolar };
  const oxirgi = foydalanuvchi.rejalar[0];
  const ozgarmadi =
    oxirgi &&
    oxirgi.kaloriya === yangi.kaloriya &&
    oxirgi.oqsil === yangi.oqsil &&
    oxirgi.yog === yangi.yog &&
    oxirgi.uglevod === yangi.uglevod;
  if (!ozgarmadi) await klient.reja.create({ data: { foydalanuvchiId, ...yangi } });
  return yangi;
}

/**
 * Berilgan kun uchun amaldagi reja: shu kun oxirigacha hisoblangan eng so'nggi qator.
 * Birinchi rejadan oldingi kunlar eng birinchi reja bilan ko'rsatiladi. Hisobda umuman
 * reja bo'lmasa (S4'gacha ro'yxatdan o'tganlar) shu yerda hisoblab yoziladi.
 * `klient` — chaqiruvchining tranzaksiyasi (bo'lsa, o'qish ham yozish ham shuning ichida).
 */
export async function kunRejasi(
  foydalanuvchiId: string,
  sana: string,
  klient?: Prisma.TransactionClient,
): Promise<Reja | null> {
  const baza = klient ?? db;
  const { oxiri } = sanaOraligi(sana);
  const reja =
    (await baza.reja.findFirst({
      where: { foydalanuvchiId, hisoblangan: { lt: oxiri } },
      orderBy: { hisoblangan: "desc" },
      select: REJA_MAYDONLARI,
    })) ??
    (await baza.reja.findFirst({
      where: { foydalanuvchiId },
      orderBy: { hisoblangan: "asc" },
      select: REJA_MAYDONLARI,
    }));
  return reja ?? rejaniYangilash(foydalanuvchiId, klient);
}
