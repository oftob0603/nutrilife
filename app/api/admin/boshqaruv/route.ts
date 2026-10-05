import { adminTekshiruvi, boshqaruvRaqamlari } from "@/lib/services/admin";

/** A1 boshqaruv paneli raqamlari — faqat admin. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  return Response.json({ boshqaruv: await boshqaruvRaqamlari() });
}
