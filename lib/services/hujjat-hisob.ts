// Huquqiy hujjat matnini (hujjatlar/*.md) ekranga chiqariladigan bo'laklarga ajratadi.
// Matnning yagona manbai — o'sha .md fayllar; ular `scripts/hujjat-yig.mjs` orqali
// `lib/hujjatlar.ts` ga yig'iladi, shuning uchun Vercel'da fayl tizimi o'qilmaydi.
//
// Fayl qolipi (hujjatlar shunday yozilgan):
//   1-qator — sarlavha; keyin "Amal qilish sanasi: …" va "Versiya: …";
//   band sarlavhasi — "1. …" yoki "1.1. …" bilan boshlanadi;
//   xatboshi — bo'sh qatorlar orasidagi bitta qator;
//   ro'yxat — bo'sh qator bilan ajralmagan ketma-ket qatorlar.

export type Bolak =
  | { tur: "sarlavha"; daraja: 2 | 3; matn: string }
  | { tur: "xatboshi"; matn: string }
  | { tur: "royxat"; qatorlar: string[] };

export type Hujjat = {
  /** Fayldagi 1-qator — to'liq rasmiy nom. */
  nomi: string;
  /** "Amal qilish sanasi: …" qatori, bo'lmasa null. */
  sana: string | null;
  /** "Versiya: …" dagi qiymat, bo'lmasa null. */
  versiya: string | null;
  bolaklar: Bolak[];
};

/** Matn qismi: oddiy matn yoki boshqa hujjatga havola (`href` — ilova ichidagi sahifa). */
export type Qism = { matn: string; href?: string };

/**
 * Matn ichida boshqa hujjat nomi tilga olinsa — o'sha sahifaga havola. Faqat bosh harfli rasmiy
 * nom (o'zbekcha va ruscha qo'shimchasi bilan — ↗ belgisi so'z oxirida turadi), umumiy
 * "maxfiylik" yoki "foydalanish shartlari" iborasi havola bo'lmaydi.
 */
const HUJJAT_HAVOLALARI: readonly { naqsh: RegExp; href: string }[] = [
  { naqsh: /Maxfiylik siyosat[a-z]*|Политик[а-яё]* конфиденциальности|Privacy Policy/g, href: "/maxfiylik" },
  { naqsh: /Foydalanish shartlar[a-z]*|Услови[а-яё]* использования|Terms of Use/g, href: "/shartlar" },
];

/** Qatorni oddiy matn va havola qismlariga bo'ladi; `ozi` — joriy hujjat, o'ziga havola qo'yilmaydi. */
export function havolalargaBol(matn: string, ozi: string): Qism[] {
  const topilgan: { boshi: number; oxiri: number; href: string }[] = [];
  for (const { naqsh, href } of HUJJAT_HAVOLALARI) {
    if (href === ozi) continue;
    for (const mos of matn.matchAll(naqsh)) {
      topilgan.push({ boshi: mos.index, oxiri: mos.index + mos[0].length, href });
    }
  }
  if (topilgan.length === 0) return [{ matn }];

  topilgan.sort((a, b) => a.boshi - b.boshi);
  const qismlar: Qism[] = [];
  let joy = 0;
  for (const { boshi, oxiri, href } of topilgan) {
    if (boshi < joy) continue;
    if (boshi > joy) qismlar.push({ matn: matn.slice(joy, boshi) });
    qismlar.push({ matn: matn.slice(boshi, oxiri), href });
    joy = oxiri;
  }
  if (joy < matn.length) qismlar.push({ matn: matn.slice(joy) });
  return qismlar;
}

const SARLAVHA = /^(\d+)\.(\d+)?\.?\s+\S/;
const SANA = /^(Amal qilish sanasi|Дата вступления в силу|Effective date):\s*(.+)$/;
const VERSIYA = /^(Versiya|Версия|Version):\s*(.+)$/;

function sarlavhaBolagi(qator: string): Bolak | null {
  const mos = SARLAVHA.exec(qator);
  return mos ? { tur: "sarlavha", daraja: mos[2] ? 3 : 2, matn: qator } : null;
}

/** Ketma-ket qatorlar to'dasi: sarlavhalar alohida, qolgani bitta xatboshi yoki ro'yxat. */
function todaniAjrat(toda: string[]): Bolak[] {
  const bolaklar: Bolak[] = [];
  let joriy: string[] = [];
  const yop = () => {
    if (joriy.length === 1) bolaklar.push({ tur: "xatboshi", matn: joriy[0] });
    else if (joriy.length > 1) bolaklar.push({ tur: "royxat", qatorlar: joriy });
    joriy = [];
  };

  for (const qator of toda) {
    const sarlavha = sarlavhaBolagi(qator);
    if (sarlavha) {
      yop();
      bolaklar.push(sarlavha);
    } else {
      joriy.push(qator);
    }
  }
  yop();
  return bolaklar;
}

/** Hujjat matnini bo'laklarga ajratadi. Matn bo'sh bo'lsa — bo'sh hujjat. */
export function hujjatniOqi(matn: string): Hujjat {
  const qatorlar = matn.replace(/\r\n/g, "\n").split("\n");
  const nomi = qatorlar.shift()?.trim() ?? "";

  let sana: string | null = null;
  let versiya: string | null = null;
  const toda: string[] = [];
  const bolaklar: Bolak[] = [];

  for (const xom of qatorlar) {
    const qator = xom.trim();
    if (qator === "") {
      bolaklar.push(...todaniAjrat(toda.splice(0)));
      continue;
    }
    const sanaMos = SANA.exec(qator);
    const versiyaMos = VERSIYA.exec(qator);
    if (sanaMos) sana = sanaMos[2].trim();
    else if (versiyaMos) versiya = versiyaMos[2].trim();
    else toda.push(qator);
  }
  bolaklar.push(...todaniAjrat(toda));

  return { nomi, sana, versiya, bolaklar };
}
