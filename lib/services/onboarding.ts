import { db } from "../db.ts";
import { SHARTLAR_VERSIYASI } from "../shartlar.ts";
import {
  QADAMLAR_SONI,
  type Javoblar,
  type OnboardingHolati,
  type OvqatlanishOdati,
  type QadamJavobi,
} from "./onboarding-hisob.ts";

// Standart chegara (2 s kutish, 5 s ish) lokal ishlab chiqishda yetmaydi: uzoqdagi bazaga
// har so'rov ~0,4 s, saqlash tranzaksiyasi esa 4–6 ta so'rovdan iborat.
const TRANZAKSIYA_VAQTI = { maxWait: 10_000, timeout: 20_000 };

function odatniOqi(qiymat: unknown): OvqatlanishOdati | null {
  if (typeof qiymat !== "object" || qiymat === null) return null;
  const { mahal, joy } = qiymat as Record<string, unknown>;
  return typeof mahal === "string" && typeof joy === "string" ? { mahal, joy } : null;
}

/** Foydalanuvchi qaysi qadamda to'xtagan va nima javob bergan; hisob topilmasa null. */
export async function onboardingHolati(foydalanuvchiId: string): Promise<OnboardingHolati | null> {
  const foydalanuvchi = await db.foydalanuvchi.findUnique({
    where: { id: foydalanuvchiId },
    select: {
      birliklar: true,
      profil: true,
      // Onboardingdagi vazn — eng birinchi yozuv (progress grafigining boshlang'ich nuqtasi).
      vaznYozuvlari: { orderBy: { vaqt: "asc" }, take: 1, select: { vazn: true, maqsad: true } },
    },
  });
  if (!foydalanuvchi) return null;

  const { profil } = foydalanuvchi;
  const vaznYozuvi = foydalanuvchi.vaznYozuvlari[0] ?? null;
  const javoblar: Javoblar = {
    birliklar: foydalanuvchi.birliklar,
    ism: profil?.ism ?? null,
    maqsad: profil?.maqsad ?? null,
    jins: profil?.jins ?? null,
    yosh: profil?.yosh ?? null,
    boyi: profil?.boyi ?? null,
    vazn: vaznYozuvi?.vazn ?? null,
    maqsadVazn: vaznYozuvi?.maqsad ?? null,
    faollik: profil?.faollik ?? null,
    ovqatAfzalliklari: profil?.ovqatAfzalliklari ?? [],
    ovqatlanishOdati: odatniOqi(profil?.ovqatlanishOdati),
    motivatsiya: profil?.motivatsiya ?? null,
  };

  return {
    qadam: Math.min(Math.max(profil?.onboardingQadami ?? 1, 1), QADAMLAR_SONI),
    tugadi: Boolean(profil?.onboardingTugadi),
    javoblar,
  };
}

/** 3-qadamda tanlangan maqsad — o'lchovlar (5-qadam) tekshiruvi shunga tayanadi. */
export async function tanlanganMaqsad(foydalanuvchiId: string): Promise<string | null> {
  const profil = await db.profil.findUnique({
    where: { foydalanuvchiId },
    select: { maqsad: true },
  });
  return profil?.maqsad ?? null;
}

/**
 * Bitta qadam javobini saqlaydi (har javob darhol yoziladi — yarmida chiqib ketgan odam
 * o'sha joydan davom etadi). Oxirgi qadamda onboarding yakunlangan deb belgilanadi.
 */
export async function qadamniSaqlash(foydalanuvchiId: string, javob: QadamJavobi): Promise<void> {
  await db.$transaction(async (tx) => {
    const mavjud = await tx.profil.findUnique({
      where: { foydalanuvchiId },
      select: { onboardingQadami: true, onboardingTugadi: true },
    });

    const profil: {
      ism?: string;
      maqsad?: string;
      jins?: string;
      yosh?: number;
      boyi?: number;
      faollik?: string;
      ovqatAfzalliklari?: string[];
      ovqatlanishOdati?: OvqatlanishOdati;
      motivatsiya?: string | null;
    } = {};

    // Qabul va tasdiq vaqtlari faqat birinchi marta yoziladi — orqaga qaytib qayta bosish
    // yoki yoshni o'zgartirish dastlabki vaqtni surmaydi.
    switch (javob.qadam) {
      case 1:
        await tx.foydalanuvchi.updateMany({
          where: { id: foydalanuvchiId, shartlarQabul: null },
          data: { shartlarQabul: new Date(), shartlarVersiyasi: SHARTLAR_VERSIYASI },
        });
        break;
      case 2:
        profil.ism = javob.ism;
        break;
      case 3:
        profil.maqsad = javob.maqsad;
        break;
      case 4:
        profil.jins = javob.jins;
        profil.yosh = javob.yosh;
        // 18 dan kichik yosh bu yerga yetib kelmaydi (`qadamniTekshir`).
        await tx.foydalanuvchi.updateMany({
          where: { id: foydalanuvchiId, tasdiq18plus: null },
          data: { tasdiq18plus: new Date() },
        });
        break;
      case 5: {
        profil.boyi = javob.boyi;
        await tx.foydalanuvchi.update({
          where: { id: foydalanuvchiId },
          data: { birliklar: javob.birliklar },
        });
        // Orqaga qaytib o'zgartirilsa o'sha birinchi yozuv yangilanadi — grafikda soxta nuqta paydo bo'lmasin.
        const birinchi = await tx.vaznYozuvi.findFirst({
          where: { foydalanuvchiId },
          orderBy: { vaqt: "asc" },
          select: { id: true },
        });
        const vazn = { vazn: javob.vazn, maqsad: javob.maqsadVazn };
        if (birinchi) await tx.vaznYozuvi.update({ where: { id: birinchi.id }, data: vazn });
        else await tx.vaznYozuvi.create({ data: { foydalanuvchiId, ...vazn } });
        break;
      }
      case 6:
        profil.faollik = javob.faollik;
        break;
      // O'tkazib yuborilsa (7–9) avvalgi javob (bo'lsa) o'zgarmaydi.
      case 7:
        if (javob.ovqatAfzalliklari) profil.ovqatAfzalliklari = javob.ovqatAfzalliklari;
        break;
      case 8:
        if (javob.ovqatlanishOdati) profil.ovqatlanishOdati = javob.ovqatlanishOdati;
        break;
      case 9:
        if (javob.motivatsiya) profil.motivatsiya = javob.motivatsiya;
        break;
    }

    const tugadi =
      javob.qadam === QADAMLAR_SONI && !mavjud?.onboardingTugadi ? { onboardingTugadi: new Date() } : {};
    const onboardingQadami = Math.max(mavjud?.onboardingQadami ?? 1, javob.qadam + 1);

    await tx.profil.upsert({
      where: { foydalanuvchiId },
      create: { foydalanuvchiId, ...profil, ...tugadi, onboardingQadami },
      update: { ...profil, ...tugadi, onboardingQadami },
    });
  }, TRANZAKSIYA_VAQTI);
}
