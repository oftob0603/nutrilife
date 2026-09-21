import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "../db.ts";

const COOKIE_NOMI = "nl_sessiya";
/** Har ochilishda cookie yangilanadi, shuning uchun muddat faqat 30 kun kirmagan odamda tugaydi. */
const MUDDAT_SONIYA = 30 * 24 * 60 * 60;

const TOKEN_QOLIPI = /^([0-9a-f-]{36})\.(\d{1,12})\.([A-Za-z0-9_-]{43})$/;

/**
 * `SameSite=None` + `Partitioned`: Telegram Web Mini App'ni iframe ichida ochadi — boshqa
 * sozlamada cookie u yerda yuborilmaydi. Evaziga `GET` bo'lmagan so'rovlarda `Origin`
 * tekshiriladi (`begonaManba`).
 */
const COOKIE_ATRIBUTLARI = "Path=/; HttpOnly; Secure; SameSite=None; Partitioned";

/** `SESSION_SECRET` sozlanmagan — sessiya na yaratiladi, na o'qiladi. */
export class SessiyaSiriYoq extends Error {}

function sir(): string {
  const qiymat = process.env.SESSION_SECRET;
  if (!qiymat) throw new SessiyaSiriYoq("SESSION_SECRET sozlanmagan");
  return qiymat;
}

function imzo(malumot: string): Buffer {
  return createHmac("sha256", sir()).update(malumot).digest();
}

/** Token: `<foydalanuvchiId>.<tugash vaqti, soniya>.<imzo>` — bazada saqlanmaydi. */
function tokenYarat(foydalanuvchiId: string, hozir: Date): string {
  const malumot = `${foydalanuvchiId}.${Math.floor(hozir.getTime() / 1000) + MUDDAT_SONIYA}`;
  return `${malumot}.${imzo(malumot).toString("base64url")}`;
}

/** Tokendagi foydalanuvchi ID'si; imzo noto'g'ri yoki muddat o'tgan bo'lsa null. */
export function tokenniTekshir(token: string, hozir: Date = new Date()): string | null {
  const mos = TOKEN_QOLIPI.exec(token);
  if (!mos) return null;
  const [, foydalanuvchiId, tugash, berilganImzo] = mos;

  const kutilgan = imzo(`${foydalanuvchiId}.${tugash}`);
  const berilgan = Buffer.from(berilganImzo, "base64url");
  if (berilgan.length !== kutilgan.length || !timingSafeEqual(kutilgan, berilgan)) return null;

  return Number(tugash) > hozir.getTime() / 1000 ? foydalanuvchiId : null;
}

/** Kirish javobiga qo'yiladigan `Set-Cookie` qiymati. */
export function sessiyaCookie(foydalanuvchiId: string, hozir: Date = new Date()): string {
  const token = tokenYarat(foydalanuvchiId, hozir);
  return `${COOKIE_NOMI}=${token}; Max-Age=${MUDDAT_SONIYA}; ${COOKIE_ATRIBUTLARI}`;
}

/** Sessiyani o'chiradigan `Set-Cookie` qiymati (chiqish). */
export function sessiyaniOchirishCookie(): string {
  return `${COOKIE_NOMI}=; Max-Age=0; ${COOKIE_ATRIBUTLARI}`;
}

function cookiedanToken(sorov: Request): string | null {
  const sarlavha = sorov.headers.get("cookie");
  if (!sarlavha) return null;
  for (const bolak of sarlavha.split(";")) {
    const [nom, ...qiymat] = bolak.trim().split("=");
    if (nom === COOKIE_NOMI) return qiymat.join("=");
  }
  return null;
}

/**
 * O'zgartiruvchi so'rov boshqa saytdan kelganmi. `SameSite=None` cookie begona sahifadan
 * yuborilgan so'rovga ham qo'shiladi — brauzer qo'ygan `Origin` o'z manzilimizga teng
 * bo'lmasa, so'rov egasiz deb hisoblanadi.
 */
function begonaManba(sorov: Request): boolean {
  if (sorov.method === "GET" || sorov.method === "HEAD") return false;
  const origin = sorov.headers.get("origin");
  if (!origin) return false;
  const host = sorov.headers.get("x-forwarded-host") ?? sorov.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

/** Faqat cookie'dagi sessiya bo'yicha ega — lokal zaxirasiz; yaroqli sessiya bo'lmasa null. */
export function sessiyadagiId(sorov: Request): string | null {
  const token = cookiedanToken(sorov);
  if (!token) return null;
  try {
    return tokenniTekshir(token);
  } catch (xato) {
    if (!(xato instanceof SessiyaSiriYoq)) throw xato;
    console.error(xato.message);
    return null;
  }
}

/**
 * So'rov egasining `foydalanuvchilar.id` si; aniqlanmasa null. API yo'llari egani faqat
 * shu yerdan oladi — servislarga ID tayyor holda uzatiladi.
 */
export async function joriyFoydalanuvchiId(sorov: Request): Promise<string | null> {
  if (begonaManba(sorov)) return null;

  const sessiyadagi = sessiyadagiId(sorov);
  if (sessiyadagi) return sessiyadagi;

  // Lokal ishlab chiqish: Telegram'dan tashqarida initData yo'q, shuning uchun sessiyasiz
  // so'rov bazadagi birinchi hisob (birinchi admin) nomidan o'tadi. Production'da bu yo'l yopiq.
  if (process.env.NODE_ENV !== "production") {
    const birinchi = await db.foydalanuvchi.findFirst({
      orderBy: { yaratilgan: "asc" },
      select: { id: true },
    });
    return birinchi?.id ?? null;
  }
  return null;
}

/**
 * So'rov egasi admin bo'lsa uning ID'si, aks holda null. Rol har so'rovda bazadan o'qiladi —
 * tokenda saqlanmaydi, shuning uchun olib qo'yilgan rol darhol kuchdan qoladi.
 */
export async function joriyAdminId(sorov: Request): Promise<string | null> {
  const foydalanuvchiId = await joriyFoydalanuvchiId(sorov);
  if (!foydalanuvchiId) return null;
  const admin = await db.foydalanuvchi.findFirst({
    where: { id: foydalanuvchiId, rol: "admin" },
    select: { id: true },
  });
  return admin?.id ?? null;
}

/** Egasi aniq, lekin bu amalga huquqi yo'q so'rovga javob. */
export function ruxsatYoq(): Response {
  return Response.json({ xato: "Ruxsat yo'q" }, { status: 403 });
}

/** Egasi aniqlanmagan so'rovga javob. */
export function kirishKerak(): Response {
  return Response.json({ xato: "Kirish talab qilinadi" }, { status: 401 });
}
