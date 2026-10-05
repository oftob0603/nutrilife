// Admin paneli (S6, admin-tz.md) uchun servis: kim admin, boshqaruv paneli raqamlari.
// Rol har so'rovda bazadan o'qiladi (lib/services/sessiya.ts `joriyAdminId`) — tokenda emas.

import { db } from "../db.ts";
import { joriyFoydalanuvchiId, kirishKerak, ruxsatYoq } from "./sessiya.ts";
import { bugunSana, sanaOraligi } from "./yozuv-hisob.ts";

const KUN_MS = 24 * 60 * 60 * 1000;

export type Admin = { id: string; ism: string | null };

/**
 * `/api/admin/*` yo'llari uchun bitta tekshiruv: sessiya yo'q — 401, bor-u admin emas — 403
 * (A0 ikkalasini farqlaydi: kirish tugmasi yoki rad javobi). Admin bo'lsa uning ma'lumoti.
 */
export async function adminTekshiruvi(sorov: Request): Promise<{ admin: Admin } | { javob: Response }> {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return { javob: kirishKerak() };
  const admin = await adminniOl(foydalanuvchiId);
  return admin ? { admin } : { javob: ruxsatYoq() };
}

/** Hisob admin bo'lsa uning ma'lumoti, aks holda null. */
export async function adminniOl(foydalanuvchiId: string): Promise<Admin | null> {
  const topildi = await db.foydalanuvchi.findFirst({
    where: { id: foydalanuvchiId, rol: "admin" },
    select: { id: true, profil: { select: { ism: true } } },
  });
  return topildi ? { id: topildi.id, ism: topildi.profil?.ism ?? null } : null;
}

/**
 * Login Widget orqali kirgan Telegram hisobi admin bo'lsa uning ma'lumoti. Hisob yo'q yoki
 * admin emas — null: panelga kirish yangi hisob yaratmaydi (hisob Mini App'dan ochiladi).
 */
export async function telegramBoyichaAdmin(telegramId: bigint): Promise<Admin | null> {
  const topildi = await db.foydalanuvchi.findFirst({
    where: { telegramId, rol: "admin" },
    select: { id: true, profil: { select: { ism: true } } },
  });
  return topildi ? { id: topildi.id, ism: topildi.profil?.ism ?? null } : null;
}

export type Boshqaruv = {
  /** Bugun (Toshkent kuni) yaratilgan hisoblar. */
  bugungiYangi: number;
  /** Bugun ilovani ochganlar (`hodisalar.kunlik_faollik`). */
  kunlikFaol: number;
  /** Bugun limitdan yeyilgan skanlar yig'indisi. */
  bugungiSkanlar: number;
  /** Hozir faol PRO obunasi bor foydalanuvchilar. */
  faolPro: number;
  /** Oxirgi obunasi 7 kun ichida tugaydigan foydalanuvchilar (uzaytirganlar sanalmaydi). */
  tugayotganObunalar: number;
};

/** A1 boshqaruv paneli raqamlari — hammasi mavjud jadvallardan, bitta so'rov to'plamida. */
export async function boshqaruvRaqamlari(hozir: Date = new Date()): Promise<Boshqaruv> {
  const bugun = bugunSana();
  const { boshi, oxiri } = sanaOraligi(bugun);
  const sana = new Date(`${bugun}T00:00:00.000Z`);
  const yettiKunKeyin = new Date(hozir.getTime() + 7 * KUN_MS);

  const [bugungiYangi, kunlikFaol, skanlar, faolObunalar, tugayotganlar] = await Promise.all([
    db.foydalanuvchi.count({ where: { yaratilgan: { gte: boshi, lt: oxiri } } }),
    db.hodisa.count({ where: { tur: "kunlik_faollik", sana } }),
    db.skanHisobi.aggregate({ _sum: { soni: true }, where: { sana } }),
    db.obuna.findMany({
      where: { boshlanish: { lte: hozir }, tugash: { gt: hozir } },
      select: { foydalanuvchiId: true },
      distinct: ["foydalanuvchiId"],
    }),
    db.obuna.groupBy({
      by: ["foydalanuvchiId"],
      _max: { tugash: true },
      having: { tugash: { _max: { gt: hozir, lte: yettiKunKeyin } } },
    }),
  ]);

  return {
    bugungiYangi,
    kunlikFaol,
    bugungiSkanlar: skanlar._sum.soni ?? 0,
    faolPro: faolObunalar.length,
    tugayotganObunalar: tugayotganlar.length,
  };
}
