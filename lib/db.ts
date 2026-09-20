import { PrismaPg } from "@prisma/adapter-pg";
// Nisbiy yo'l va .ts kengaytmasi — shunda bu fayl Next.js'da ham, seed kabi
// oddiy Node skriptlarida ham bir xil ishlaydi.
import { PrismaClient } from "./generated/prisma/client.ts";

// Dev rejimida hot reload har safar yangi ulanish ochmasligi uchun
// klient globalThis'da saqlanadi.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
