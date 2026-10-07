import { RASM_CHEGARASI, RASM_CHEGARASI_MB, rasmTuri } from "@/lib/services/rasm-hisob";
import { taomKirishiniTekshir, type TaomKirishi } from "@/lib/services/taom-admin-hisob";
import type { YangiRasm } from "@/lib/services/taom-admin";

export type ShaklNatijasi = { kirish: TaomKirishi; rasm: YangiRasm | null } | { xato: string; status: number };

/**
 * A7 shakli (multipart): matn maydonlari `taomKirishiniTekshir` ga, `rasm` fayli bo'lsa hajmi va
 * mazmuni tekshiriladi (`/api/rasmlar` bilan bir xil qoida: 4 MB, JPEG/PNG/WebP).
 */
export async function shaklniOqi(sorov: Request): Promise<ShaklNatijasi> {
  const uzunlik = Number(sorov.headers.get("content-length"));
  if (uzunlik > RASM_CHEGARASI + 64 * 1024) {
    return { xato: `Rasm ${RASM_CHEGARASI_MB} MB dan katta`, status: 413 };
  }

  let shakl: FormData;
  try {
    shakl = await sorov.formData();
  } catch {
    return { xato: "So'rov o'qilmadi", status: 400 };
  }

  const tana: Record<string, unknown> = {};
  for (const [kalit, qiymat] of shakl.entries()) {
    if (typeof qiymat === "string") tana[kalit] = qiymat;
  }
  const tekshiruv = taomKirishiniTekshir(tana);
  if ("xato" in tekshiruv) return { xato: tekshiruv.xato, status: 400 };

  const fayl = shakl.get("rasm");
  let rasm: YangiRasm | null = null;
  if (fayl instanceof File && fayl.size > 0) {
    if (fayl.size > RASM_CHEGARASI) {
      return { xato: `Rasm ${RASM_CHEGARASI_MB} MB dan katta`, status: 413 };
    }
    const baytlar = new Uint8Array(await fayl.arrayBuffer());
    const tur = rasmTuri(baytlar);
    if (!tur) return { xato: "Faqat rasm yuklash mumkin: JPEG, PNG yoki WebP", status: 415 };
    rasm = { baytlar, tur };
  }

  return { kirish: tekshiruv.kirish, rasm };
}
