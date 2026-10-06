"use client";

import { useEffect } from "react";
import { Tugma } from "@/app/_components/Tugma";
import { Belgi } from "./Belgi";

/**
 * Admin tasdiq oynasi (prototip `Modal`): parda, sarlavha, izoh, mazmun, "Bekor qilish" va
 * tasdiq tugmasi. Xavfli amalda (`xavfli`) tasdiq xato rangida. Parda yoki Escape yopadi;
 * so'rov ketayotganda yopilmaydi. Eni 480 (prototip `--admin-modal-w`).
 */
export function AdminOyna({
  sarlavha,
  izoh,
  tasdiqMatni,
  tasdiqOchiq = true,
  xavfli = false,
  yuborilmoqda = false,
  onTasdiq,
  onYop,
  children,
}: {
  sarlavha: string;
  izoh?: string;
  tasdiqMatni: string;
  tasdiqOchiq?: boolean;
  xavfli?: boolean;
  yuborilmoqda?: boolean;
  onTasdiq: () => void;
  onYop: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const bosildi = (hodisa: KeyboardEvent) => {
      if (hodisa.key === "Escape" && !yuborilmoqda) onYop();
    };
    window.addEventListener("keydown", bosildi);
    return () => window.removeEventListener("keydown", bosildi);
  }, [onYop, yuborilmoqda]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 lg:p-6">
      <button
        type="button"
        aria-label="Yopish"
        disabled={yuborilmoqda}
        onClick={onYop}
        className="absolute inset-0 bg-parda"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={sarlavha}
        className="relative flex max-h-[84vh] w-full max-w-[480px] flex-col gap-4 overflow-y-auto rounded-karta border border-karta-chegara bg-karta p-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 className="text-sarlavha">{sarlavha}</h2>
            {izoh && <p className="text-asosiy text-matn-2">{izoh}</p>}
          </div>
          <button
            type="button"
            aria-label="Yopish"
            disabled={yuborilmoqda}
            onClick={onYop}
            className="-mt-3 -mr-3 grid size-11 shrink-0 place-items-center text-matn-2"
          >
            <Belgi nomi="x" olcham={20} />
          </button>
        </div>
        {children}
        <div className="flex justify-end gap-2">
          <Tugma korinish="uchinchi" kichik disabled={yuborilmoqda} onClick={onYop}>
            Bekor qilish
          </Tugma>
          <Tugma
            korinish={xavfli ? "xatoToldiruv" : "siyoh"}
            kichik
            disabled={!tasdiqOchiq}
            yuklanmoqda={yuborilmoqda}
            onClick={onTasdiq}
          >
            {tasdiqMatni}
          </Tugma>
        </div>
      </section>
    </div>
  );
}

/** Oyna ichidagi maydon yorlig'i (prototip `Textarea`/`Select` label): izoh shriftida, majburiyda `*`. */
export function OynaYorligi({
  nomi,
  majburiy = false,
  children,
}: {
  nomi: string;
  majburiy?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="flex gap-1 text-izoh text-matn-2">
        {nomi}
        {majburiy && <span className="text-xato">*</span>}
      </span>
      {children}
    </label>
  );
}

/** Oyna ichidagi tanlov chiplari (prototip `Chip`): bitta tanlanadi. */
export function OynaChiplar<T extends string>({
  nomi,
  qiymat,
  variantlar,
  onTanla,
}: {
  nomi: string;
  qiymat: T;
  variantlar: readonly { id: T; nomi: string }[];
  onTanla: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-izoh text-matn-2">{nomi}</span>
      <div className="flex flex-wrap gap-2">
        {variantlar.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={qiymat === v.id}
            onClick={() => onTanla(v.id)}
            className={`min-h-11 rounded-chip border px-4 text-asosiy font-medium tabular-nums transition-colors ${
              qiymat === v.id ? "border-siyoh bg-siyoh text-on-siyoh" : "border-chegara bg-karta text-siyoh"
            }`}
          >
            {v.nomi}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Matn maydonlarining umumiy ko'rinishi (prototip `Input`/`Textarea`): karta fon, 1px chegara, fokusda siyoh. */
export const MAYDON_SINFI =
  "w-full rounded-karta border border-chegara bg-karta px-4 py-3 text-asosiy text-siyoh outline-none placeholder:text-matn-3 focus:border-siyoh disabled:opacity-40";
