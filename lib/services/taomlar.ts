import { db } from "../db.ts";

export type Taom = {
  id: string;
  nomi: string;
  olchovMiqdori: number;
  olchovBirligi: string;
  kaloriya: number;
  oqsil: number;
  yog: number;
  uglevod: number;
  porsiyalar: number[];
};

/** Taom bazasi, nomi bo'yicha tartiblangan. */
export async function taomlarniOl(): Promise<Taom[]> {
  return db.taom.findMany({
    orderBy: { nomi: "asc" },
    select: {
      id: true,
      nomi: true,
      olchovMiqdori: true,
      olchovBirligi: true,
      kaloriya: true,
      oqsil: true,
      yog: true,
      uglevod: true,
      porsiyalar: true,
    },
  });
}

/** Karta ostidagi izoh: "100 g · 186 kkal" yoki "1 dona · 310 kkal". */
export function olchovIzohi(taom: Taom): string {
  return `${taom.olchovMiqdori} ${taom.olchovBirligi} · ${taom.kaloriya} kkal`;
}
