"use client";

import { useId, type Ref } from "react";

/**
 * Onboarding kiritish maydoni. Ostida yo xato (to'sadi, qizil), yo ogohlantirish
 * (to'smaydi, kulrang) turadi — har izoh faqat o'zi tegishli maydon ostida.
 */
export function OnboardingMaydoni({
  nomi,
  birlik,
  qiymat,
  xato,
  ogohlantirish,
  turi = "son",
  inputRef,
  onChange,
}: {
  nomi: string;
  birlik?: string;
  qiymat: string;
  /** `true` — maydon qizil chegara oladi, matni esa boshqa joyda (juft maydonlar uchun). */
  xato?: string | true;
  ogohlantirish?: string;
  turi?: "son" | "butun" | "matn";
  inputRef?: Ref<HTMLInputElement>;
  onChange: (matn: string) => void;
}) {
  const id = useId();
  const izoh = typeof xato === "string" ? xato : xato ? undefined : ogohlantirish;
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-izoh text-matn-2">
        {nomi}
      </label>
      <div
        className={`flex min-h-13 items-center gap-2 rounded-karta border bg-karta px-4 ${
          xato ? "border-xato" : "border-chegara"
        }`}
      >
        <input
          id={id}
          ref={inputRef}
          type="text"
          inputMode={turi === "son" ? "decimal" : turi === "butun" ? "numeric" : undefined}
          autoComplete={turi === "matn" ? "given-name" : "off"}
          value={qiymat}
          maxLength={turi === "matn" ? 60 : 6}
          aria-invalid={xato ? true : undefined}
          aria-describedby={izoh ? `${id}-izoh` : undefined}
          onChange={(hodisa) => onChange(hodisa.target.value)}
          className="w-full min-w-0 bg-transparent text-asosiy tabular-nums outline-none"
        />
        {birlik && <span className="shrink-0 text-izoh text-matn-2">{birlik}</span>}
      </div>
      {izoh && (
        <p id={`${id}-izoh`} className={`text-izoh ${xato ? "text-xato" : "text-matn-2"}`}>
          {izoh}
        </p>
      )}
    </div>
  );
}
