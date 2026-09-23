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
