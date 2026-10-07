import { adminTekshiruvi } from "@/lib/services/admin";
import { kategoriyalarRoyxati, kategoriyaNominiOqi, kategoriyaQoshish } from "@/lib/services/kategoriya-admin";

/** A9 kategoriya tanlovi. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  return Response.json({ kategoriyalar: await kategoriyalarRoyxati() });
}

/** "Yangi kategoriya" oynasi — `{ nomi }`. Band bo'lsa 409. */
export async function POST(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;

  let tana: unknown;
  try {
    tana = await sorov.json();
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }
  const nomi = kategoriyaNominiOqi((tana as { nomi?: unknown } | null)?.nomi);
  if (!nomi) return Response.json({ xato: "Nomi 2–40 belgi bo'lsin" }, { status: 400 });

  const natija = await kategoriyaQoshish(nomi);
  if (natija === "band") return Response.json({ xato: "Bunday kategoriya bor" }, { status: 409 });
  return Response.json({ kategoriya: natija }, { status: 201 });
}
