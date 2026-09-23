"use client";

import { useId } from "react";
import { OvqatTuriTanlagich } from "@/app/_components/OvqatTuriTanlagich";
import { Ikona } from "@/app/_components/progress/Ikona";
import { useTarjima } from "@/app/_components/TilTaminoti";
import {
  miqdorOzgardi,
  qiymatOzgardi,
  type Forma,
  type FormaXatolari,
  type FormaXatosi,
} from "@/lib/services/yozuv-forma";

/**
 * Bitta kiritish maydoni: yorliq, (bo'lsa) birlik va ostida tekshiruv xatosi.
 * `taxminiy` — qiymat AI taxmini: oldida "~" turadi (prototip E7 `approx`), foydalanuvchi
 * yozgan zahoti yo'qoladi. Belgi qiymatning o'zida emas — kiritish oqimini buzmaydi.
 */
export function Maydon({
  nomi,
  birlik,
  qiymat,
  xato,
  ogohlantirish,
  turi = "son",
  taxminiy = false,
  ajratilgan = false,
  bloklangan,
  onChange,
}: {
  nomi: string;
  birlik?: string;
  qiymat: string;
  xato?: string;
  /** To'smaydigan izoh (prototip `Input warning`) — xato bo'lmaganda, o'sha joyda, kulrang. */
  ogohlantirish?: string;
  turi?: "son" | "matn" | "vaqt";
  taxminiy?: boolean;
  /** Ko'zga birinchi tashlanadigan maydon (E7 kaloriya): aksent foni, chegarasi va yorlig'i. */
  ajratilgan?: boolean;
  bloklangan: boolean;
  onChange: (matn: string) => void;
}) {
  const id = useId();
  const izoh = xato ?? ogohlantirish;
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label
        htmlFor={id}
        className={`text-izoh ${ajratilgan ? "font-medium text-aksent-yorliq" : "text-matn-2"}`}
      >
        {nomi}
      </label>
      <div
        // Prototip `Input`: 44 px dan past emas, fokusda chegara --siyoh.
        className={`flex min-h-11 items-center gap-2 rounded-karta border px-4 transition-colors ${
          ajratilgan ? "bg-aksent-fon" : "bg-karta"
        } ${xato ? "border-xato" : ajratilgan ? "border-aksent" : "border-chegara focus-within:border-siyoh"}`}
      >
        {ajratilgan && (
          <Ikona nomi="olov" olcham={14} className="-ml-1 shrink-0 text-aksent-yorliq" />
        )}
        {taxminiy && (
          <span aria-hidden="true" className="-mr-2 shrink-0 text-asosiy text-matn-2">
            ~
          </span>
        )}
        <input
          id={id}
          type={turi === "vaqt" ? "time" : "text"}
          inputMode={turi === "son" ? "decimal" : undefined}
          value={qiymat}
          disabled={bloklangan}
          maxLength={turi === "son" ? 8 : 80}
          aria-invalid={xato ? true : undefined}
          aria-describedby={izoh ? `${id}-xato` : undefined}
          onChange={(hodisa) => onChange(hodisa.target.value)}
          className={`w-full min-w-0 bg-transparent py-3 text-asosiy tabular-nums outline-none disabled:opacity-60 ${
            ajratilgan ? "font-semibold" : ""
          }`}
        />
        {birlik && <span className="shrink-0 text-izoh text-matn-2">{birlik}</span>}
      </div>
      {izoh && (
        <p id={`${id}-xato`} className={`text-izoh ${xato ? "text-xato" : "text-matn-2"}`}>
          {izoh}
        </p>
      )}
    </div>
  );
}

/**
 * Yozuv maydonlari — AI natijasini tasdiqlash (E7) va yozuv tahriri (E10) uchun umumiy.
 * Holat ota komponentda turadi: saqlash xatosida kiritilgan ma'lumot yo'qolmasin.
 * `taxminiy` — sonli maydonlar AI taxmini ("~"); `porsiyaIzohi` — porsiya va kaloriya
 * qatori ostidagi izoh (E7'dagi "AI porsiyani taxmin qildi…").
 */
export function YozuvFormasi({
  forma,
  xatolar,
  birlik,
  bloklangan = false,
  taxminiy = false,
  kaloriyaAjratilgan = false,
  porsiyaIzohi,
  onChange,
}: {
  forma: Forma;
  xatolar: FormaXatolari;
  /** Porsiya o'lchov birligi: "g" yoki "dona". */
  birlik: string;
  bloklangan?: boolean;
  taxminiy?: boolean;
  /** E7 natija ekrani: kaloriya maydoni aksent bilan ajratiladi (DESIGN.md). */
  kaloriyaAjratilgan?: boolean;
  porsiyaIzohi?: React.ReactNode;
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
          taxminiy={taxminiy}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(miqdorOzgardi(forma, matn))}
        />
        <Maydon
          nomi={t("Kaloriya")}
          birlik={t("kkal")}
          qiymat={forma.kaloriya}
          xato={matn(xatolar.kaloriya)}
          taxminiy={taxminiy}
          ajratilgan={kaloriyaAjratilgan}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(qiymatOzgardi(forma, "kaloriya", matn))}
        />
      </div>

      {porsiyaIzohi}

      <div className="grid grid-cols-3 gap-3">
        <Maydon
          nomi={t("Oqsil")}
          birlik={t("g")}
          qiymat={forma.oqsil}
          xato={matn(xatolar.oqsil)}
          taxminiy={taxminiy}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(qiymatOzgardi(forma, "oqsil", matn))}
        />
        <Maydon
          nomi={t("Yog'")}
          birlik={t("g")}
          qiymat={forma.yog}
          xato={matn(xatolar.yog)}
          taxminiy={taxminiy}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(qiymatOzgardi(forma, "yog", matn))}
        />
        <Maydon
          nomi={t("Uglevod")}
          birlik={t("g")}
          qiymat={forma.uglevod}
          xato={matn(xatolar.uglevod)}
          taxminiy={taxminiy}
          bloklangan={bloklangan}
          onChange={(matn) => onChange(qiymatOzgardi(forma, "uglevod", matn))}
        />
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-karta-sarlavha">{t("Ovqat turi")}</h2>
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
