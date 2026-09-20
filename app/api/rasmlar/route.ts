import { rasmSaqlash } from "@/lib/services/rasmlar";
import {
  RASM_CHEGARASI,
  RASM_CHEGARASI_MB,
  rasmTuri,
} from "@/lib/services/rasm-hisob";

const KATTA = `Rasm ${RASM_CHEGARASI_MB} MB dan katta`;

/** Ovqat rasmini qabul qiladi: multipart, `rasm` maydoni. Faqat rasm, hajmi chegaralangan. */
export async function POST(sorov: Request) {
  // Katta tana o'qilmasdan rad etiladi; multipart chegaralari uchun biroz zaxira.
  const uzunlik = Number(sorov.headers.get("content-length"));
  if (uzunlik > RASM_CHEGARASI + 64 * 1024) {
    return Response.json({ xato: KATTA }, { status: 413 });
  }

  let fayl: FormDataEntryValue | null;
  try {
    fayl = (await sorov.formData()).get("rasm");
  } catch {
    return Response.json({ xato: "So'rov o'qilmadi" }, { status: 400 });
  }

  if (!(fayl instanceof File) || fayl.size === 0) {
    return Response.json({ xato: "Rasm yuborilmadi" }, { status: 400 });
  }
  if (fayl.size > RASM_CHEGARASI) {
    return Response.json({ xato: KATTA }, { status: 413 });
  }

  const baytlar = new Uint8Array(await fayl.arrayBuffer());
  const tur = rasmTuri(baytlar);
  if (!tur) {
    return Response.json(
      { xato: "Faqat rasm yuklash mumkin: JPEG, PNG yoki WebP" },
      { status: 415 },
    );
  }

  try {
    const rasm = await rasmSaqlash(baytlar, tur);
    return Response.json({ rasm }, { status: 201 });
  } catch (xato) {
    console.error("Rasm saqlanmadi:", xato instanceof Error ? xato.message : xato);
    return Response.json(
      { xato: "Rasmni saqlab bo'lmadi. Qayta urinib ko'ring" },
      { status: 502 },
    );
  }
}
