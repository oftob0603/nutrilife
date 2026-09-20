import { onboardingHolati, qadamniSaqlash, tanlanganMaqsad } from "@/lib/services/onboarding";
import { qadamniTekshir } from "@/lib/services/onboarding-hisob";
import { joriyFoydalanuvchiId, kirishKerak } from "@/lib/services/sessiya";

/** Onboarding holati: qaysi qadamda to'xtagan va shu paytgacha bergan javoblari. */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  const holat = foydalanuvchiId ? await onboardingHolati(foydalanuvchiId) : null;
  return holat ? Response.json(holat) : kirishKerak();
}

/** Bitta qadam javobini saqlaydi: `{ qadam, ...javob }` yoki `{ qadam, otkazildi: true }`. */
export async function PATCH(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return kirishKerak();

  let tana: Record<string, unknown>;
  try {
    tana = (await sorov.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }
  if (typeof tana !== "object" || tana === null) {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  // O4'dagi maqsad faqat O6 tekshiruviga kerak (maqsad vazn talabi va yo'nalishi).
  const maqsad = tana.qadam === 6 ? await tanlanganMaqsad(foydalanuvchiId) : null;
  const tekshiruv = qadamniTekshir(tana, maqsad);
  if ("xato" in tekshiruv) {
    return Response.json({ xato: tekshiruv.xato }, { status: 400 });
  }

  await qadamniSaqlash(foydalanuvchiId, tekshiruv.javob);
  return new Response(null, { status: 204 });
}
