// Server tomonda joriy til. Haqiqiy manba — `foydalanuvchilar.til`; cookie uning tezkor
// nusxasi: sahifa chizilayotganda bazaga qo'shimcha so'rov ketmaydi.

import { headers } from "next/headers";
import { tarjimon, tilniOqi, type Tarjimon, type Til } from "./tarjima.ts";

const COOKIE_NOMI = "nl_til";
const MUDDAT_SONIYA = 365 * 24 * 60 * 60;

/** Sessiya cookie'si bilan bir xil atributlar — Telegram Web iframe ichida ham yuborilsin. */
const COOKIE_ATRIBUTLARI = "Path=/; HttpOnly; Secure; SameSite=None; Partitioned";

/** Kirish javobiga qo'yiladigan `Set-Cookie` qiymati — har ochilishda bazadagi tilga tenglashadi. */
export function tilCookie(til: string): string {
  return `${COOKIE_NOMI}=${tilniOqi(til)}; Max-Age=${MUDDAT_SONIYA}; ${COOKIE_ATRIBUTLARI}`;
}

function cookiedanTil(sarlavha: string | null): Til {
  for (const bolak of sarlavha?.split(";") ?? []) {
    const [nom, qiymat] = bolak.trim().split("=");
    if (nom === COOKIE_NOMI) return tilniOqi(qiymat);
  }
  return "uz";
}

/** API yo'llari uchun: so'rovdagi cookie bo'yicha til. */
export function sorovTili(sorov: Request): Til {
  return cookiedanTil(sorov.headers.get("cookie"));
}

/** Joriy so'rov egasining tili; cookie hali qo'yilmagan bo'lsa (birinchi ochilish) — o'zbekcha. */
export async function serverTili(): Promise<Til> {
  return cookiedanTil((await headers()).get("cookie"));
}

/** Server komponentlar uchun tarjimon: `const { t } = await serverTarjimoni()`. */
export async function serverTarjimoni(): Promise<Tarjimon> {
  return tarjimon(await serverTili());
}
