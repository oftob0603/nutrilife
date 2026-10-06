import { adminTekshiruvi, boshqaruvRaqamlari, oxirgiAmallar } from "@/lib/services/admin";

/** A1 boshqaruv paneli: raqamlar va oxirgi 10 admin amali — faqat admin. */
export async function GET(sorov: Request) {
  const tekshiruv = await adminTekshiruvi(sorov);
  if ("javob" in tekshiruv) return tekshiruv.javob;
  const [boshqaruv, amallar] = await Promise.all([boshqaruvRaqamlari(), oxirgiAmallar()]);
  return Response.json({ boshqaruv, amallar });
}
