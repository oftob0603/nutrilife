import { db } from "../db.ts";
import type { Taom } from "./taom-hisob.ts";

export type { Taom };

const TAOM_MAYDONLARI = {
  id: true,
  nomi: true,
  nomiRu: true,
  nomiEn: true,
  rasm: true,
  olchovMiqdori: true,
  olchovBirligi: true,
  kaloriya: true,
  oqsil: true,
  yog: true,
  uglevod: true,
  porsiyalar: true,
} as const;

/** Taom bazasi, nomi bo'yicha tartiblangan. */
export async function taomlarniOl(): Promise<Taom[]> {
  return db.taom.findMany({
    orderBy: { nomi: "asc" },
    select: TAOM_MAYDONLARI,
  });
}

/** Bitta taom; topilmasa null. */
export async function taomniOl(id: string): Promise<Taom | null> {
  return db.taom.findUnique({
    where: { id },
    select: TAOM_MAYDONLARI,
  });
}
