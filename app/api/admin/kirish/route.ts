import { botUsername } from "@/lib/services/bot";
import { telegramBoyichaAdmin } from "@/lib/services/admin";
import { ruxsatYoq, sessiyaCookie, SessiyaSiriYoq } from "@/lib/services/sessiya";
import { loginMalumotiniTekshir } from "@/lib/services/telegram-login";

function ishlamayapti() {
  return Response.json({ xato: "Kirish vaqtincha ishlamayapti" }, { status: 500 });
}

/** A0 uchun bot username'i — Login Widget `data-telegram-login` shuni talab qiladi. */
export async function GET() {
  return Response.json({ bot: await botUsername() });
}

/**
 * Admin paneliga kirish (A0): Telegram Login Widget bergan obyekt imzosi tekshiriladi,
 * hisob `rol = admin` bo'lsa oddiy sessiya cookie'si qo'yiladi. Admin bo'lmagan hisobga
 * sessiya berilmaydi va yangi hisob yaratilmaydi — 403.
 */
export async function POST(sorov: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN sozlanmagan");
    return ishlamayapti();
  }

  let tana: { malumot?: unknown };
  try {
    tana = (await sorov.json()) as { malumot?: unknown };
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  const tekshiruv = loginMalumotiniTekshir(tana?.malumot, botToken);
  if ("xato" in tekshiruv) {
    return tekshiruv.xato === "format"
      ? Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 })
      : Response.json({ xato: "Telegram orqali kirish tasdiqlanmadi" }, { status: 401 });
  }

  const admin = await telegramBoyichaAdmin(tekshiruv.telegramId);
  if (!admin) return ruxsatYoq();

  try {
    return Response.json(
      { admin: { ism: admin.ism } },
      { headers: { "Set-Cookie": sessiyaCookie(admin.id) } },
    );
  } catch (xato) {
    if (!(xato instanceof SessiyaSiriYoq)) throw xato;
    console.error(xato.message);
    return ishlamayapti();
  }
}
