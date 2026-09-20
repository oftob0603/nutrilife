import {
  foydalanuvchiniOl,
  telegramBoyichaTopYokiYarat,
} from "@/lib/services/foydalanuvchilar";
import {
  joriyFoydalanuvchiId,
  kirishKerak,
  sessiyaCookie,
  sessiyadagiId,
  sessiyaniOchirishCookie,
  SessiyaSiriYoq,
} from "@/lib/services/sessiya";
import { initDataniTekshir } from "@/lib/services/telegram-initdata";

function ishlamayapti() {
  return Response.json({ xato: "Kirish vaqtincha ishlamayapti" }, { status: 500 });
}

/** Joriy sessiya egasi — ilova ochilganda initData bo'lmasa shu bilan tekshiriladi. */
export async function GET(sorov: Request) {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  const foydalanuvchi = foydalanuvchiId ? await foydalanuvchiniOl(foydalanuvchiId) : null;
  return foydalanuvchi ? Response.json({ foydalanuvchi }) : kirishKerak();
}

/**
 * Telegram initData bilan kirish: imzo tasdiqlansa hisob topiladi yoki yaratiladi va
 * sessiya cookie'si qo'yiladi (har kirishda yangilanadi).
 */
export async function POST(sorov: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN sozlanmagan");
    return ishlamayapti();
  }

  let tana: Record<string, unknown>;
  try {
    tana = (await sorov.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }
  if (typeof tana?.initData !== "string" || tana.initData === "") {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  const tekshiruv = initDataniTekshir(tana.initData, botToken);
  if ("xato" in tekshiruv) {
    return tekshiruv.xato === "format"
      ? Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 })
      : Response.json({ xato: "Telegram orqali kirish tasdiqlanmadi" }, { status: 401 });
  }

  const { foydalanuvchi, yangi } = await telegramBoyichaTopYokiYarat(
    tekshiruv.telegramId,
    tekshiruv.til,
  );

  let cookie: string;
  try {
    cookie = sessiyaCookie(foydalanuvchi.id);
  } catch (xato) {
    if (!(xato instanceof SessiyaSiriYoq)) throw xato;
    console.error(xato.message);
    return ishlamayapti();
  }

  // Sahifa shu hisob sessiyasi bilan chizilgan bo'lsa, klient uni qayta yuklamaydi.
  const sessiyaBorEdi = sessiyadagiId(sorov) === foydalanuvchi.id;
  return Response.json(
    { foydalanuvchi, yangi, sessiyaBorEdi },
    { headers: { "Set-Cookie": cookie } },
  );
}

/** Chiqish: sessiya cookie'si o'chiriladi. */
export async function DELETE() {
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": sessiyaniOchirishCookie() },
  });
}
