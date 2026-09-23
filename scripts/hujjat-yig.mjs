#!/usr/bin/env node
/**
 * `hujjatlar/*.md` matnlarini `lib/hujjatlar.ts` ga yig'adi — ilova matnni fayl tizimidan
 * emas, shu moduldan o'qiydi (Vercel'da hujjat fayllari yonma-yon turmaydi).
 * Hujjat matni o'zgarsa yoki yangi til qo'shilsa shuni qayta ishga tushiring:
 *
 *   node scripts/hujjat-yig.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';

const MANBA = 'hujjatlar';
const CHIQISH = 'lib/hujjatlar.ts';
const TILLAR = ['uz', 'ru', 'en'];

const fayllar = (await readdir(MANBA)).filter((nom) => nom.endsWith('.md')).sort();
const hujjatlar = new Map();

for (const fayl of fayllar) {
  const [kalit, til] = fayl.replace(/\.md$/, '').split('.');
  if (!TILLAR.includes(til)) throw new Error(`${fayl}: til noma'lum (${TILLAR.join(', ')})`);
  const matn = (await readFile(`${MANBA}/${fayl}`, 'utf8')).replace(/\r\n/g, '\n').trim();
  if (!hujjatlar.has(kalit)) hujjatlar.set(kalit, {});
  hujjatlar.get(kalit)[til] = matn;
}

for (const [kalit, tillar] of hujjatlar) {
  if (!tillar.uz) throw new Error(`${kalit}: o'zbekcha matn yo'q (zaxira til)`);
}

// Matn TS ichida shablon satr bo'lib turadi — teskari chiziq, tirnoqcha va ${ qochiriladi.
const qochir = (matn) =>
  matn.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${');

const tana = [...hujjatlar]
  .map(([kalit, tillar]) => {
    const ichi = TILLAR.filter((til) => tillar[til])
      .map((til) => `    ${til}: \`${qochir(tillar[til])}\`,`)
      .join('\n');
    return `  ${kalit}: {\n${ichi}\n  },`;
  })
  .join('\n');

const chiqish = `// AVTOMATIK YARATILGAN — qo'lda tahrirlanmaydi.
// Manba: hujjatlar/*.md · yangilash: node scripts/hujjat-yig.mjs

import type { Til } from "./lugat/tarjima.ts";

/** Hujjat matnlari: kalit -> til -> xom matn. O'zbekchasi doim bor (zaxira til). */
export const HUJJAT_MATNLARI: Record<string, Partial<Record<Til, string>>> = {
${tana}
};

/** Tanlangan tildagi matn; tarjimasi bo'lmasa — o'zbekchasi. Hujjat yo'q bo'lsa null. */
export function hujjatMatni(kalit: string, til: Til): string | null {
  const tillar = HUJJAT_MATNLARI[kalit];
  return tillar ? (tillar[til] ?? tillar.uz ?? null) : null;
}

/** Matn shu tilda bormi — yo'q bo'lsa ekranda "hozircha o'zbek tilida" izohi chiqadi. */
export function hujjatShuTildami(kalit: string, til: Til): boolean {
  return Boolean(HUJJAT_MATNLARI[kalit]?.[til]);
}
`;

await writeFile(CHIQISH, chiqish, 'utf8');
console.log(`${CHIQISH} yangilandi — ${hujjatlar.size} hujjat, ${fayllar.length} fayl`);
