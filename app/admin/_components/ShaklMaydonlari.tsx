"use client";

import { MAYDON_SINFI, OynaYorligi } from "./AdminOyna";

/** Muharrir shakllari (A7, A9) uchun umumiy bo'laklar — karta, maydon, son o'qish, xato matni. */

export function Karta({
  sarlavha,
  yorliq,
  children,
}: {
  sarlavha: string;
  /** Sarlavha yonidagi belgi (A9: "FREE ga ko'rinadi" / "PRO ostida"). */
  yorliq?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-karta border border-karta-chegara bg-karta p-4">
      <h2 className="flex items-center gap-2 text-karta-sarlavha">
        {sarlavha}
        {yorliq}
      </h2>
      {children}
    </section>
  );
}

/** Matn/son maydoni (prototip `Input`): yorliq, ixtiyoriy birlik, xato matni ostida. */
export function Maydon({
  nomi,
  qiymat,
  onChange,
  birlik,
  raqam = false,
  majburiy = false,
  maxLength,
  xato,
}: {
  nomi: string;
  qiymat: string;
  onChange: (qiymat: string) => void;
  birlik?: string;
  raqam?: boolean;
  majburiy?: boolean;
  maxLength?: number;
  xato?: string;
}) {
  return (
    <OynaYorligi nomi={nomi} majburiy={majburiy}>
      <span className="relative block">
        <input
          type="text"
          inputMode={raqam ? "decimal" : undefined}
          value={qiymat}
          maxLength={maxLength ?? (raqam ? 12 : 80)}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={xato ? true : undefined}
          className={`${MAYDON_SINFI}${raqam ? " tabular-nums" : ""}${birlik ? " pr-12" : ""}${xato ? " border-xato" : ""}`}
        />
        {birlik && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-izoh text-matn-3">
            {birlik}
          </span>
        )}
      </span>
      {xato && <span className="text-izoh text-xato">{xato}</span>}
    </OynaYorligi>
  );
}

/** "12,5" ham o'qiladi; bo'sh yoki son emas — NaN. */
export function son(matn: string): number {
  const toza = matn.trim().replace(",", ".");
  return toza === "" ? NaN : Number(toza);
}

/** Server xatosi matni; o'qilmasa umumiy matn (DESIGN.md 7-bo'lim: texnik matn ko'rsatilmaydi). */
export async function xatoMatni(javob: Response): Promise<string> {
  try {
    const tana = (await javob.json()) as { xato?: unknown };
    if (typeof tana.xato === "string") return tana.xato;
  } catch {
    // tana bo'sh yoki JSON emas
  }
  return "Saqlab bo'lmadi. Qayta urinib ko'ring";
}
