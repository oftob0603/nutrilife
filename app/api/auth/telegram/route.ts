import { telegramBoyichaTopYokiYarat } from "@/lib/services/foydalanuvchilar";
import { initDataniTekshir } from "@/lib/services/telegram-initdata";

/** Telegram initData bilan kirish: imzo tasdiqlansa hisob topiladi yoki yaratiladi. */
export async function POST(sorov: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN sozlanmagan");
    return Response.json({ xato: "Kirish vaqtincha ishlamayapti" }, { status: 500 });
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
  return Response.json({ foydalanuvchi, yangi });
}
