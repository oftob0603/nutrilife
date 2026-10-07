import { RASM_CHEGARASI, RASM_CHEGARASI_MB, rasmTuri } from "@/lib/services/rasm-hisob";
import type { SaqlashNatijasi, YangiRasm } from "@/lib/services/retsept-admin";
import { retseptKirishiniTekshir, type RetseptKirishi } from "@/lib/services/retsept-admin-hisob";

export type ShaklNatijasi = { kirish: RetseptKirishi; rasm: YangiRasm | null } | { xato: string; status: number };

/**
 * A9 shakli (multipart): matn maydonlari `retseptKirishiniTekshir` ga, `rasm` fayli bo'lsa hajmi va
 * mazmuni tekshiriladi (`/api/rasmlar` bilan bir xil qoida: 4 MB, JPEG/PNG/WebP). Matn maydonlari
 * (masalliqlar va qadamlar uch tilda) taomnikidan kattaroq — chegara zaxirasi 256 KB.
 */
export async function shaklniOqi(sorov: Request): Promise<ShaklNatijasi> {
  const uzunlik = Number(sorov.headers.get("content-length"));
  if (uzunlik > RASM_CHEGARASI + 256 * 1024) {
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
  const tekshiruv = retseptKirishiniTekshir(tana);
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

/** Servis natijasi xato bo'lsa HTTP javobi; `{ id }` bo'lsa null — yo'l o'zi javob beradi. */
export function natijaXatosi(natija: SaqlashNatijasi): Response | null {
  if (natija === "topilmadi") return Response.json({ xato: "Retsept topilmadi" }, { status: 404 });
  if (natija === "kategoriya_yoq") return Response.json({ xato: "Kategoriya topilmadi" }, { status: 400 });
  if ("toliq_emas" in natija) return Response.json({ xato: natija.toliq_emas }, { status: 422 });
  return null;
}
