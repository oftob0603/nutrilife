import { kunlikYozuvlar, yozuvYaratish } from "@/lib/services/ovqat-yozuvlari";
import { bugunSana, kunlikJami } from "@/lib/services/yozuv-hisob";

const SANA_QOLIPI = /^\d{4}-\d{2}-\d{2}$/;

function son(qiymat: unknown): number {
  const natija = Number(qiymat);
  return Number.isFinite(natija) ? natija : 0;
}

/** Bir kunning yozuvlari va jami: `?sana=2026-09-20` (standart — bugun). */
export async function GET(sorov: Request) {
  const berilgan = new URL(sorov.url).searchParams.get("sana");
  const sana = berilgan && SANA_QOLIPI.test(berilgan) ? berilgan : bugunSana();

  const yozuvlar = await kunlikYozuvlar(sana);
  return Response.json({ sana, yozuvlar, jami: kunlikJami(yozuvlar) });
}

/** Jurnalga yangi yozuv qo'shadi. */
export async function POST(sorov: Request) {
  let tana: Record<string, unknown>;
  try {
    tana = (await sorov.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  const taomNomi = typeof tana.taomNomi === "string" ? tana.taomNomi.trim() : "";
  const ovqatTuri = typeof tana.ovqatTuri === "string" ? tana.ovqatTuri : "";
  if (!taomNomi || !ovqatTuri) {
    return Response.json(
      { xato: "Taom nomi va ovqat turi kerak" },
      { status: 400 },
    );
  }

  const yozuv = await yozuvYaratish({
    taomId: typeof tana.taomId === "string" ? tana.taomId : null,
    taomNomi,
    porsiya: typeof tana.porsiya === "string" ? tana.porsiya : "",
    kaloriya: son(tana.kaloriya),
    oqsil: son(tana.oqsil),
    yog: son(tana.yog),
    uglevod: son(tana.uglevod),
    ovqatTuri,
  });

  return Response.json({ yozuv }, { status: 201 });
}
