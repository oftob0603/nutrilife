import type { Prisma } from "../generated/prisma/client.ts";
import { kunRejasi } from "./rejalar.ts";
import { nutritionScore } from "./score-hisob.ts";
import { sanaOraligi } from "./yozuv-hisob.ts";
import { FAOL_HOLATLAR } from "./yozuv-holati.ts";

/**
 * Bir kunning `kunlik_xulosa` qatorini yozuvlardan qayta hisoblaydi: jami kaloriya, makrolar
 * va Nutrition Score. Yozuv qo'shilganda, tahrirlanganda va o'chirilganda shu tranzaksiya
 * ichida chaqiriladi — natija har doim yozuvlardan kelib chiqadi, qo'shib-ayirib borilmaydi.
 * Kunda faol yozuv qolmasa qator ham qolmaydi: kuzatilmagan kun xulosada ko'rinmaydi.
 * Ball tarifdan qat'i nazar yoziladi — ko'rsatish huquqi alohida (`huquqlar.nutritionScore`).
 */
export async function xulosaniYangilash(
  klient: Prisma.TransactionClient,
  foydalanuvchiId: string,
  sana: string,
): Promise<void> {
  // Kun bo'yicha qulf, tranzaksiya oxirigacha: parallel yozuvlar bir-birining o'zgarishini
  // ko'rmay eskirgan jamini yozib qo'ymaydi — keyingisi oldingisi tugagach hisoblaydi.
  await klient.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`xulosa:${foydalanuvchiId}:${sana}`}))`;

  const { boshi, oxiri } = sanaOraligi(sana);
  const yigindi = await klient.ovqatYozuvi.aggregate({
    where: { foydalanuvchiId, holat: { in: FAOL_HOLATLAR }, vaqt: { gte: boshi, lt: oxiri } },
    _count: true,
    _sum: { kaloriya: true, oqsil: true, yog: true, uglevod: true },
  });

  const kalit = { foydalanuvchiId, sana: new Date(`${sana}T00:00:00.000Z`) };
  if (yigindi._count === 0) {
    await klient.kunlikXulosa.deleteMany({ where: kalit });
    return;
  }

  const jami = {
    kaloriya: yigindi._sum.kaloriya ?? 0,
    oqsil: yigindi._sum.oqsil ?? 0,
    yog: yigindi._sum.yog ?? 0,
    uglevod: yigindi._sum.uglevod ?? 0,
  };
  const reja = await kunRejasi(foydalanuvchiId, sana, klient);
  const qiymatlar = { ...jami, nutritionScore: reja ? (nutritionScore(jami, reja)?.ball ?? null) : null };

  await klient.kunlikXulosa.upsert({
    where: { foydalanuvchiId_sana: kalit },
    create: { ...kalit, ...qiymatlar },
    update: qiymatlar,
  });
}
