// Admin paneli (S6, admin-tz.md) uchun servis: kim admin, boshqaruv paneli raqamlari.
// Rol har so'rovda bazadan o'qiladi (lib/services/sessiya.ts `joriyAdminId`) — tokenda emas.

import { db } from "../db.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import {
  foydalanuvchiHolati,
  manbaniOqi,
  SAHIFA_HAJMI,
  type FoydalanuvchiFiltri,
  type FoydalanuvchiHolati,
  type ObunaManbai,
} from "./admin-hisob.ts";
import {
  faolMuddat,
  huquqlar,
  obunaHolati,
  rolniOqi,
  skanQoldigi,
  TARIFLAR,
  type SkanQoldigi,
  type Tarif,
} from "./huquqlar.ts";
import { joriyFoydalanuvchiId, kirishKerak, ruxsatYoq } from "./sessiya.ts";
import { bugunSana, sanaOraligi } from "./yozuv-hisob.ts";
import { FAOL_HOLATLAR } from "./yozuv-holati.ts";

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

// ——— A2 foydalanuvchilar ro'yxati va A3 karta ———

/** A2 jadvalining bir qatori. Sanalar ISO matn — JSON orqali o'tadi; Telegram ID ham matn (BigInt). */
export type FoydalanuvchiQatori = {
  id: string;
  ism: string | null;
  telegramId: string | null;
  username: string | null;
  holat: FoydalanuvchiHolati;
  /** Hisob roli admin — jadvalda alohida belgi. */
  admin: boolean;
  /** Faol PRO: tarif va tugash lahzasi; FREE yoki tugagan — null. */
  obuna: { tarif: Tarif; tugash: string } | null;
  royxat: string;
  /** `hodisalar.kunlik_faollik` oxirgi kuni (YYYY-MM-DD); hech qachon kirmagan — null. */
  oxirgiFaollik: string | null;
  /** Jami limitdan yeyilgan skanlar. */
  skanlar: number;
};

export type FoydalanuvchilarSahifasi = {
  qatorlar: FoydalanuvchiQatori[];
  jami: number;
  sahifa: number;
};

const QATOR_MAYDONLARI = {
  id: true,
  telegramId: true,
  username: true,
  rol: true,
  bloklangan: true,
  yaratilgan: true,
  profil: { select: { ism: true } },
  obunalar: { select: { tarif: true, boshlanish: true, tugash: true } },
} as const;

/** Qidiruv: ism yoki username ichida (katta-kichik farqsiz), raqam bo'lsa Telegram ID aynan. */
function qidiruvSharti(q: string | null): Prisma.FoydalanuvchiWhereInput {
  if (!q) return {};
  const matn = q.replace(/^@/, "");
  const shartlar: Prisma.FoydalanuvchiWhereInput[] = [
    { profil: { ism: { contains: matn, mode: "insensitive" } } },
    { username: { contains: matn, mode: "insensitive" } },
  ];
  if (/^\d{1,19}$/.test(matn)) shartlar.push({ telegramId: BigInt(matn) });
  return { OR: shartlar };
}

/** Filtr: PRO — hozir faol obuna qatori bor; FREE — yo'q; ikkalasi ham bloklanmaganlar ichida. */
function filtrSharti(filtr: FoydalanuvchiFiltri, hozir: Date): Prisma.FoydalanuvchiWhereInput {
  const faolObuna = { some: { boshlanish: { lte: hozir }, tugash: { gt: hozir } } };
  switch (filtr) {
    case "bloklangan":
      return { bloklangan: { not: null } };
    case "pro":
      return { bloklangan: null, obunalar: faolObuna };
    case "free":
      return { bloklangan: null, NOT: { obunalar: faolObuna } };
    default:
      return {};
  }
}

/** Bir guruh hisobning oxirgi faollik kuni va jami skanlari — ikkita guruhlash so'rovi. */
async function faollikVaSkanlar(
  idlar: string[],
): Promise<{ faollik: Map<string, string>; skanlar: Map<string, number> }> {
  const faollik = new Map<string, string>();
  const skanlar = new Map<string, number>();
  if (idlar.length === 0) return { faollik, skanlar };

  const [hodisalar, hisoblar] = await Promise.all([
    db.hodisa.groupBy({
      by: ["foydalanuvchiId"],
      where: { foydalanuvchiId: { in: idlar }, tur: "kunlik_faollik" },
      _max: { sana: true },
    }),
    db.skanHisobi.groupBy({
      by: ["foydalanuvchiId"],
      where: { foydalanuvchiId: { in: idlar } },
      _sum: { soni: true },
    }),
  ]);
  for (const h of hodisalar) {
    if (h.foydalanuvchiId && h._max.sana) {
      faollik.set(h.foydalanuvchiId, h._max.sana.toISOString().slice(0, 10));
    }
  }
  for (const s of hisoblar) skanlar.set(s.foydalanuvchiId, s._sum.soni ?? 0);
  return { faollik, skanlar };
}

/** A2 — foydalanuvchilar ro'yxati: qidiruv, filtr, 50 tadan sahifa, yangilari birinchi. */
export async function foydalanuvchilarRoyxati(
  q: string | null,
  filtr: FoydalanuvchiFiltri,
  sahifa: number,
  hozir: Date = new Date(),
): Promise<FoydalanuvchilarSahifasi> {
  const where: Prisma.FoydalanuvchiWhereInput = {
    AND: [qidiruvSharti(q), filtrSharti(filtr, hozir)],
  };
  const [jami, hisoblar] = await Promise.all([
    db.foydalanuvchi.count({ where }),
    db.foydalanuvchi.findMany({
      where,
      orderBy: { yaratilgan: "desc" },
      skip: (sahifa - 1) * SAHIFA_HAJMI,
      take: SAHIFA_HAJMI,
      select: QATOR_MAYDONLARI,
    }),
  ]);
  const { faollik, skanlar } = await faollikVaSkanlar(hisoblar.map((h) => h.id));

  const qatorlar = hisoblar.map((h): FoydalanuvchiQatori => {
    const muddat = faolMuddat(h.obunalar, hozir);
    return {
      id: h.id,
      ism: h.profil?.ism ?? null,
      telegramId: h.telegramId?.toString() ?? null,
      username: h.username,
      holat: foydalanuvchiHolati(h.bloklangan !== null, muddat !== null),
      admin: rolniOqi(h.rol) === "admin",
      obuna: muddat ? { tarif: muddat.tarif, tugash: muddat.tugash.toISOString() } : null,
      royxat: h.yaratilgan.toISOString(),
      oxirgiFaollik: faollik.get(h.id) ?? null,
      skanlar: skanlar.get(h.id) ?? 0,
    };
  });
  return { qatorlar, jami, sahifa };
}

/** A3 kartasidagi obuna tarixi qatori (`obunalar` jadvalidan, yangisi birinchi). */
export type ObunaQatoriKorinishi = {
  id: string;
  tarif: Tarif;
  manba: ObunaManbai;
  boshlanish: string;
  tugash: string;
};

/** A3 kartasidagi ovqat yozuvi — faqat ko'rsatish maydonlari (jurnal rasmlari panelda ko'rinmaydi, §4). */
export type YozuvKorinishi = {
  id: string;
  taomNomi: string;
  porsiya: string;
  kaloriya: number;
  vaqt: string;
};

export type FoydalanuvchiKartasi = {
  id: string;
  ism: string | null;
  telegramId: string | null;
  username: string | null;
  til: string;
  royxat: string;
  holat: FoydalanuvchiHolati;
  admin: boolean;
  bloklangan: string | null;
  /** Obuna holati: FREE, faol PRO (joriy qatorning tarifi va manbasi, tugash) yoki muddati tugagan. */
  obuna:
    | { holat: "free" }
    | { holat: "pro"; tarif: Tarif; manba: ObunaManbai; tugash: string }
    | { holat: "tugagan"; tugash: string };
  obunalar: ObunaQatoriKorinishi[];
  skanlar: number;
  limit: SkanQoldigi;
  oxirgiFaollik: string | null;
  yozuvlar: YozuvKorinishi[];
};

/** Bazadagi tarif qiymati; notanish qiymat — admin qo'lda bergan deb o'qiladi. */
function tarifniOqi(qiymat: string): Tarif {
  return (TARIFLAR as readonly string[]).includes(qiymat) ? (qiymat as Tarif) : "qolda";
}

/** Hisobning oxirgi 10 ovqat yozuvi (o'chirilganlar kirmaydi), yangisi birinchi. */
async function oxirgiYozuvlar(foydalanuvchiId: string): Promise<YozuvKorinishi[]> {
  const yozuvlar = await db.ovqatYozuvi.findMany({
    where: { foydalanuvchiId, holat: { in: FAOL_HOLATLAR } },
    orderBy: { vaqt: "desc" },
    take: 10,
    select: { id: true, taomNomi: true, porsiya: true, kaloriya: true, vaqt: true },
  });
  return yozuvlar.map((y) => ({ ...y, vaqt: y.vaqt.toISOString() }));
}

/** A3 — bitta foydalanuvchi kartasi; hisob topilmasa null. */
export async function foydalanuvchiKartasi(
  id: string,
  hozir: Date = new Date(),
): Promise<FoydalanuvchiKartasi | null> {
  const h = await db.foydalanuvchi.findUnique({
    where: { id },
    select: {
      ...QATOR_MAYDONLARI,
      til: true,
      obunalar: {
        select: { id: true, tarif: true, manba: true, boshlanish: true, tugash: true },
        orderBy: { boshlanish: "desc" },
      },
    },
  });
  if (!h) return null;

  const bugun = new Date(`${bugunSana()}T00:00:00.000Z`);
  const [{ faollik, skanlar }, bugungi, yozuvlar] = await Promise.all([
    faollikVaSkanlar([id]),
    db.skanHisobi.findUnique({
      where: { foydalanuvchiId_sana: { foydalanuvchiId: id, sana: bugun } },
      select: { soni: true, tanilmagan: true },
    }),
    oxirgiYozuvlar(id),
  ]);

  const obuna = obunaHolati(h.obunalar, hozir);
  const muddat = faolMuddat(h.obunalar, hozir);
  // Hozir ishlab turgan qator — manba shundan (faolMuddat tarifni ham shu qatordan oladi).
  const joriy = h.obunalar.find((o) => o.boshlanish <= hozir && o.tugash > hozir);
  const rol = rolniOqi(h.rol);
  const jamiSkan = skanlar.get(id) ?? 0;

  return {
    id: h.id,
    ism: h.profil?.ism ?? null,
    telegramId: h.telegramId?.toString() ?? null,
    username: h.username,
    til: h.til,
    royxat: h.yaratilgan.toISOString(),
    holat: foydalanuvchiHolati(h.bloklangan !== null, muddat !== null),
    admin: rol === "admin",
    bloklangan: h.bloklangan?.toISOString() ?? null,
    obuna:
      obuna.holat === "pro" && muddat
        ? {
            holat: "pro",
            tarif: muddat.tarif,
            manba: manbaniOqi(joriy?.manba ?? "tolov"),
            tugash: obuna.tugash.toISOString(),
          }
        : obuna.holat === "tugagan"
          ? { holat: "tugagan", tugash: obuna.tugash.toISOString() }
          : { holat: "free" },
    obunalar: h.obunalar.map((o) => ({
      id: o.id,
      tarif: tarifniOqi(o.tarif),
      manba: manbaniOqi(o.manba),
      boshlanish: o.boshlanish.toISOString(),
      tugash: o.tugash.toISOString(),
    })),
    skanlar: jamiSkan,
    limit: skanQoldigi(huquqlar(rol, obuna), {
      bugun: bugungi?.soni ?? 0,
      jami: jamiSkan,
      bugunTanilmagan: bugungi?.tanilmagan ?? 0,
    }),
    oxirgiFaollik: faollik.get(id) ?? null,
    yozuvlar,
  };
}

// ——— A1 admin amallari jurnali ———

export type AdminAmaliQatori = {
  id: string;
  vaqt: string;
  /** Amalni bajargan admin ismi; hisobi o'chgan bo'lsa null. */
  admin: string | null;
  tur: string;
  tafsilot: string;
  sabab: string;
  /** Kimga nisbatan: ism va karta uchun ID; hisobi o'chgan bo'lsa null. */
  foydalanuvchi: { id: string; ism: string | null } | null;
};

/** A1 "Oxirgi amallar" — jurnaldan oxirgi 10 ta (admin-tz.md A1). */
export async function oxirgiAmallar(soni = 10): Promise<AdminAmaliQatori[]> {
  const amallar = await db.adminAmali.findMany({
    orderBy: { vaqt: "desc" },
    take: soni,
    select: {
      id: true,
      vaqt: true,
      tur: true,
      tafsilot: true,
      sabab: true,
      admin: { select: { profil: { select: { ism: true } } } },
      foydalanuvchi: { select: { id: true, profil: { select: { ism: true } } } },
    },
  });
  return amallar.map((a) => ({
    id: a.id,
    vaqt: a.vaqt.toISOString(),
    admin: a.admin?.profil?.ism ?? null,
    tur: a.tur,
    tafsilot: a.tafsilot,
    sabab: a.sabab,
    foydalanuvchi: a.foydalanuvchi
      ? { id: a.foydalanuvchi.id, ism: a.foydalanuvchi.profil?.ism ?? null }
      : null,
  }));
}
