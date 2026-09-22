"use client";

import { useMemo, useState } from "react";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { vaznMatni } from "@/lib/services/profil-hisob";
import {
  farqMatni,
  ORALIQLAR,
  oraliqNuqtalari,
  sonMatni,
  vaznQiymati,
  type Oraliq,
  type Progress,
} from "@/lib/services/progress-hisob";
import { kunOyMatni } from "@/lib/services/yozuv-hisob";
import { Ikona } from "./Ikona";

const BALANDLIK = 180;
const CHAP_JOY = 30;
const KUN_MS = 24 * 60 * 60 * 1000;
// O'quvchi vazn o'qida qabul qiladigan qadamlar; ma'lumotni to'rt oraliqda qamragan eng kichigi olinadi.
const QADAMLAR = [0.5, 1, 2, 2.5, 5, 10, 20];

const kunRaqami = (sana: string) => Math.round(Date.parse(`${sana}T00:00:00.000Z`) / KUN_MS);
const kunOy = (sana: string) => `${sana.slice(8, 10)}.${sana.slice(5, 7)}`;

function Oraliqlar({ qiymat, onChange }: { qiymat: Oraliq; onChange: (oraliq: Oraliq) => void }) {
  const { t } = useTarjima();
  return (
    <div role="radiogroup" className="flex rounded-full bg-fon p-1">
      {ORALIQLAR.map((oraliq) => (
        <button
          key={oraliq}
          type="button"
          role="radio"
          aria-checked={oraliq === qiymat}
          onClick={() => onChange(oraliq)}
          className={`min-h-11 flex-1 rounded-full text-izoh font-medium transition-colors ${
            oraliq === qiymat ? "bg-karta text-siyoh shadow-[0_1px_4px_rgba(0,0,0,0.08)]" : "text-matn-2"
          }`}
        >
          {oraliq === "hammasi" ? t("Hammasi") : t("{0} kun", Number(oraliq))}
        </button>
      ))}
    </div>
  );
}

/**
 * P1 vazn grafigi (prototip `WeightChart`): faqat qayd etilgan o'lchovlar, x — sana bo'yicha
 * (10 kunlik bo'shliq 4 kunlikdan ikki yarim barobar keng), oxirgi o'lchovdan nariga
 * chizilmaydi. Y o'qi avval dumaloq qadamni tanlaydi, keyin oraliqni undan chiqaradi —
 * shunda 87,5 yozuvi 88 deb belgilangan chiziqqa tushib qolmaydi. Maqsad — punktir chiziq,
 * lekin yozuvsiz: raqam kartaning xulosa qatorida bir marta aytiladi.
 */
export function VaznGrafigi({ progress }: { progress: Progress }) {
  const t = useTarjima();
  const { til } = t;
  const { vaznBirligi: birlik, bugun, maqsadVazn } = progress;
  const [oraliq, setOraliq] = useState<Oraliq>("30");
  const [faolId, setFaolId] = useState<string | null>(null);
  const birlikNomi = birlik === "lb" ? "lb" : t.t("kg");

  const nuqtalar = useMemo(
    () =>
      oraliqNuqtalari(progress.vaznlar, oraliq, bugun).map((nuqta) => ({
        ...nuqta,
        qiymat: vaznQiymati(nuqta.vazn, birlik),
      })),
    [progress.vaznlar, oraliq, bugun, birlik],
  );
  const bittaNuqta = progress.vaznlar.length < 2;
  const maqsad = maqsadVazn === null ? null : vaznQiymati(maqsadVazn, birlik);

  let chizma: React.ReactNode;
  if (nuqtalar.length < 2) {
    chizma = (
      <div
        className="flex items-center justify-center rounded-karta border border-dashed border-chegara p-4 text-center text-izoh text-matn-2"
        style={{ height: BALANDLIK }}
      >
        {t.t("Ikkinchi o'lchovdan keyin grafik chiziladi")}
      </div>
    );
  } else {
    const qiymatlar = nuqtalar.map((nuqta) => nuqta.qiymat).concat(maqsad === null ? [] : [maqsad]);
    const engKam = Math.min(...qiymatlar);
    const engKop = Math.max(...qiymatlar);
    const kerak = engKop - engKam || 1;
    const qadam = QADAMLAR.find((q) => q * 4 >= kerak) ?? Math.ceil(kerak / 4);
    let pastki = Math.floor(engKam / qadam) * qadam;
    // O'qning o'zida turgan o'lchovga joy — bir qadam pastga.
    if (engKam - pastki < qadam * 0.15) pastki -= qadam;
    if (pastki + qadam * 4 < engKop) pastki = Math.ceil((engKop - qadam * 4) / qadam) * qadam;
    const oraliqKengligi = qadam * 4;
    const chiziqlar = [0, 1, 2, 3, 4].map((i) => pastki + qadam * i);

    const boshi = kunRaqami(nuqtalar[0].sana);
    const kunlar = kunRaqami(nuqtalar[nuqtalar.length - 1].sana) - boshi || 1;
    const x = (sana: string) => ((kunRaqami(sana) - boshi) / kunlar) * 100;
    const y = (qiymat: number) => 100 - ((qiymat - pastki) / oraliqKengligi) * 100;
    const chiziq = nuqtalar
      .map((nuqta, i) => `${i ? "L" : "M"}${x(nuqta.sana).toFixed(2)} ${y(nuqta.qiymat).toFixed(2)}`)
      .join(" ");
    const sanaYorliqlari = [0, 1, 2, 3].map((i) => ({
      sana: new Date((boshi + (kunlar * i) / 3) * KUN_MS).toISOString().slice(0, 10),
      foiz: (i / 3) * 100,
    }));
    const faol = nuqtalar.find((nuqta) => nuqta.id === faolId) ?? null;
    const korsatilgan = faol ?? nuqtalar[nuqtalar.length - 1];
    const yorliqY = (y(korsatilgan.qiymat) / 100) * BALANDLIK;
    const tepada = yorliqY - 34 >= 0;

    chizma = (
      <div className="relative" style={{ paddingLeft: CHAP_JOY }}>
        <div className="relative" style={{ height: BALANDLIK }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="block w-full overflow-visible"
            style={{ height: BALANDLIK }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="vazn-soya" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--aksent)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--aksent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {chiziqlar.map((qiymat) => (
              <line
                key={qiymat}
                x1="0"
                y1={y(qiymat)}
                x2="100"
                y2={y(qiymat)}
                stroke="var(--chegara)"
                strokeDasharray="2 4"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {sanaYorliqlari.map((yorliq) => (
              <line
                key={yorliq.foiz}
                x1={yorliq.foiz}
                y1="0"
                x2={yorliq.foiz}
                y2="100"
                stroke="var(--chegara)"
                strokeDasharray="2 4"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path d={`${chiziq} L100 100 L0 100 Z`} fill="url(#vazn-soya)" />
            {maqsad !== null && (
              <line
                x1="0"
                y1={y(maqsad)}
                x2="100"
                y2={y(maqsad)}
                stroke="var(--matn-3)"
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
            )}
            <path
              d={chiziq}
              fill="none"
              stroke="var(--aksent)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Nuqtalar SVG tashqarisida — bosish maydoni 44 px bo'lsin (cho'zilgan SVG ichida bo'lmaydi). */}
          {nuqtalar.map((nuqta) => (
            <button
              key={nuqta.id}
              type="button"
              aria-label={`${kunOyMatni(nuqta.sana, til)} — ${vaznMatni(nuqta.vazn, birlik, t)}`}
              aria-pressed={faolId === nuqta.id}
              onClick={() => setFaolId(faolId === nuqta.id ? null : nuqta.id)}
              className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${x(nuqta.sana)}%`, top: (y(nuqta.qiymat) / 100) * BALANDLIK }}
            >
              <span
                className={`block size-2.5 rounded-full border-2 border-aksent ${
                  faolId === nuqta.id ? "bg-aksent" : "bg-karta"
                }`}
              />
            </button>
          ))}
          {chiziqlar.map((qiymat) => (
            <span
              key={qiymat}
              className="absolute right-full mr-1.5 -translate-y-1/2 whitespace-nowrap text-[11px] leading-none text-matn-3 tabular-nums"
              style={{ top: (y(qiymat) / 100) * BALANDLIK }}
            >
              {sonMatni(qiymat, til)}
            </span>
          ))}
          {/* Eng so'nggi o'lchov doim belgilangan; nuqta bosilsa belgi o'sha yerga ko'chadi. Tepada
              joy bo'lmasa nuqta ostiga tushadi. */}
          <span
            className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-chip bg-aksent px-2 py-[3px] text-[11px] leading-none font-semibold text-aksent-matn tabular-nums"
            style={{
              left: `${x(korsatilgan.sana)}%`,
              top: tepada ? yorliqY - 34 : Math.min(BALANDLIK - 22, yorliqY + 12),
            }}
          >
            {vaznMatni(korsatilgan.vazn, birlik, t)}
          </span>
        </div>
        <div className="relative mt-1.5 h-[18px]">
          {sanaYorliqlari.map((yorliq) => (
            <span
              key={yorliq.foiz}
              className="absolute whitespace-nowrap text-[11px] leading-none text-matn-3 tabular-nums"
              style={{
                left: `${yorliq.foiz}%`,
                transform:
                  yorliq.foiz === 0 ? "none" : yorliq.foiz === 100 ? "translateX(-100%)" : "translateX(-50%)",
              }}
            >
              {kunOy(yorliq.sana)}
            </span>
          ))}
        </div>
        {faol && (
          <p className="mt-2 text-center text-izoh text-matn-2 tabular-nums">{kunOyMatni(faol.sana, til)}</p>
        )}
      </div>
    );
  }

  const birinchi = nuqtalar[0];
  const oxirgi = nuqtalar[nuqtalar.length - 1];

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-karta-sarlavha">{t.t("Vazn grafigi")}</h2>
      <div className="flex flex-col gap-4 rounded-karta border border-karta-chegara bg-karta p-4">
        {!bittaNuqta && <Oraliqlar qiymat={oraliq} onChange={setOraliq} />}
        {chizma}
        {/* Xulosa qatori: oraliqdagi o'zgarish va maqsad — ikkalasi ham chiziq chizilgan nuqtalardan,
            shuning uchun grafik bilan hech qachon zid kelmaydi. Qiymatlar karta sarlavhasidan bir
            pog'ona kichik: 360 px da "Maqsad: 72 kg" ikki qatorga bo'linmasin. */}
        {nuqtalar.length > 1 && (
          <div className="flex items-center gap-4 rounded-karta bg-fon px-4 py-3">
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <Ikona
                nomi={oxirgi.vazn <= birinchi.vazn ? "pasaymoqda" : "osmoqda"}
                olcham={18}
                className="text-matn-2"
              />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="whitespace-nowrap text-asosiy font-semibold tabular-nums">
                  {farqMatni(vaznQiymati(oxirgi.vazn - birinchi.vazn, birlik), til)} {birlikNomi}
                </span>
                <span className="text-[11px] leading-none text-matn-2">
                  {oraliq === "hammasi" ? t.t("Hammasi") : t.t("oxirgi {0} kunda", Number(oraliq))}
                </span>
              </span>
            </span>
            {maqsadVazn !== null && (
              <>
                <span className="w-px self-stretch bg-chegara" />
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <Ikona nomi="nishon" olcham={18} className="text-matn-2" />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="whitespace-nowrap text-asosiy font-semibold tabular-nums">
                      {t.t("Maqsad: {0}", vaznMatni(maqsadVazn, birlik, t))}
                    </span>
                    <span className="text-[11px] leading-none text-matn-2 tabular-nums">
                      {t.t("Yana {0}", vaznMatni(Math.abs(oxirgi.vazn - maqsadVazn), birlik, t))}
                    </span>
                  </span>
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
