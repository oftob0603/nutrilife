"use client";

import { useId } from "react";
import { OvqatTuriTanlagich } from "@/app/_components/OvqatTuriTanlagich";
import { useTarjima } from "@/app/_components/TilTaminoti";
import {
  miqdorOzgardi,
  qiymatOzgardi,
  type Forma,
  type FormaXatolari,
  type FormaXatosi,
} from "@/lib/services/yozuv-forma";

/** Bitta kiritish maydoni: yorliq, (bo'lsa) birlik va ostida tekshiruv xatosi. */
export function Maydon({
  nomi,
  birlik,
  qiymat,
  xato,
  turi = "son",
  bloklangan,
  onChange,
}: {
  nomi: string;
  birlik?: string;
  qiymat: string;
  xato?: string;
  turi?: "son" | "matn" | "vaqt";
  bloklangan: boolean;
  onChange: (matn: string) => void;
}) {
  const id = useId();
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
          type={turi === "vaqt" ? "time" : "text"}
          inputMode={turi === "son" ? "decimal" : undefined}
          value={qiymat}
          disabled={bloklangan}
          maxLength={turi === "son" ? 8 : 80}
          aria-invalid={xato ? true : undefined}
          aria-describedby={xato ? `${id}-xato` : undefined}
          onChange={(hodisa) => onChange(hodisa.target.value)}
          className="w-full min-w-0 bg-transparent text-asosiy tabular-nums outline-none disabled:opacity-60"
        />
        {birlik && <span className="shrink-0 text-izoh text-matn-2">{birlik}</span>}
      </div>
      {xato && (
        <p id={`${id}-xato`} className="text-izoh text-xato">
          {xato}
        </p>
      )}
    </div>
  );
}

/**
 * Yozuv maydonlari — AI natijasini tasdiqlash (E7) va yozuv tahriri (E10) uchun umumiy.
 * Holat ota komponentda turadi: saqlash xatosida kiritilgan ma'lumot yo'qolmasin.
 */
export function YozuvFormasi({
  forma,
  xatolar,
  birlik,
  bloklangan = false,
  onChange,
}: {
  forma: Forma;
  xatolar: FormaXatolari;
  /** Porsiya o'lchov birligi: "g" yoki "dona". */
  birlik: string;
  bloklangan?: boolean;
  onChange: (forma: Forma) => void;
}) {
  const { t, erkin } = useTarjima();
  const matn = (xato?: FormaXatosi) => xato && t(xato.matn, ...xato.qiymatlar);

  return (
    <div className="flex flex-col gap-4">
      <Maydon
        nomi={t("Taom nomi")}
        turi="matn"
        qiymat={forma.taomNomi}
        xato={matn(xatolar.taomNomi)}
        bloklangan={bloklangan}
        onChange={(taomNomi) => onChange({ ...forma, taomNomi })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Maydon
          nomi={t("Porsiya")}
          birlik={erkin(birlik)}
          qiymat={forma.miqdor}
          xato={matn(xatolar.miqdor)}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(miqdorOzgardi(forma, matn))}
        />
        <Maydon
          nomi={t("Kaloriya")}
          birlik={t("kkal")}
          qiymat={forma.kaloriya}
          xato={matn(xatolar.kaloriya)}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(qiymatOzgardi(forma, "kaloriya", matn))}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Maydon
          nomi={t("Oqsil")}
          birlik={t("g")}
          qiymat={forma.oqsil}
          xato={matn(xatolar.oqsil)}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(qiymatOzgardi(forma, "oqsil", matn))}
        />
        <Maydon
          nomi={t("Yog'")}
          birlik={t("g")}
          qiymat={forma.yog}
          xato={matn(xatolar.yog)}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(qiymatOzgardi(forma, "yog", matn))}
        />
        <Maydon
          nomi={t("Uglevod")}
          birlik={t("g")}
          qiymat={forma.uglevod}
          xato={matn(xatolar.uglevod)}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(qiymatOzgardi(forma, "uglevod", matn))}
        />
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-izoh text-matn-2">{t("Ovqat turi")}</h2>
        <OvqatTuriTanlagich
          qiymat={forma.ovqatTuri}
          onChange={(ovqatTuri) => {
            if (!bloklangan) onChange({ ...forma, ovqatTuri });
          }}
        />
      </section>
    </div>
  );
}
