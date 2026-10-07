"use client";

import { useState } from "react";
import { MakroChizigi } from "@/app/_components/MakroChizigi";
import { ProQulfi } from "@/app/_components/ProQulfi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import type { Kalit } from "@/lib/lugat/tarjima";
import type { OvqatStatistikasi as Statistika } from "@/lib/services/statistika";
import {
  STATISTIKA_ORALIQLARI,
  type BatafsilStatistika,
  type HaftalikHisobot,
  type StatistikaOraligi,
} from "@/lib/services/statistika-hisob";
import { raqam } from "@/lib/services/raqam";
import { haftaKuniNomi, sanaQisqa } from "@/lib/services/yozuv-hisob";

const KARTA = "flex flex-col gap-4 rounded-karta border border-karta-chegara bg-karta p-4";

function Bolim({ sarlavha, children }: { sarlavha: Kalit; children: React.ReactNode }) {
  const { t } = useTarjima();
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-karta-sarlavha">{t(sarlavha)}</h2>
      {children}
    </section>
  );
}

/** Nom — qiymat qatorlari (prototip: izoh o'lchamida, qiymat o'ngda). */
function Qatorlar({ qatorlar }: { qatorlar: [string, string][] }) {
  return (
    <div className="flex flex-col gap-2">
      {qatorlar.map(([nomi, qiymat]) => (
        <span key={nomi} className="flex gap-3 text-izoh">
          <span className="min-w-0 flex-1 text-matn-2">{nomi}</span>
          <span className="tabular-nums">{qiymat}</span>
        </span>
      ))}
    </div>
  );
}

/** Katta raqam: batafsil statistikada 40 px, haftalik hisobotda 36 px (prototip). */
function Bosh({
  kaloriya,
  izoh,
  qoshimcha,
  kichik = false,
}: {
  kaloriya: number;
  izoh: string;
  qoshimcha?: string;
  kichik?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={`font-display ${kichik ? "text-[36px]" : "text-[40px]"} leading-none font-semibold tracking-[-0.03em] tabular-nums`}
      >
        {raqam(kaloriya)}
      </span>
      <span className="text-izoh text-matn-2">{izoh}</span>
      {qoshimcha && <span className="ml-auto text-izoh text-matn-2 tabular-nums">{qoshimcha}</span>}
    </div>
  );
}

function Oraliqlar({
  qiymat,
  onChange,
}: {
  qiymat: StatistikaOraligi;
  onChange: (oraliq: StatistikaOraligi) => void;
}) {
  const { t } = useTarjima();
  return (
    <div role="radiogroup" className="flex rounded-full bg-fon p-1">
      {STATISTIKA_ORALIQLARI.map((oraliq) => (
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
          {t("{0} kun", oraliq)}
        </button>
      ))}
    </div>
  );
}

function BatafsilKarta({
  malumot,
  norma,
}: {
  malumot: { 7: BatafsilStatistika | null; 30: BatafsilStatistika | null };
  norma: Extract<Statistika, { yopiq: false }>["norma"];
}) {
  const { t, til } = useTarjima();
  const [oraliq, setOraliq] = useState<StatistikaOraligi>(30);
  const s = malumot[oraliq];

  return (
    <div className={KARTA}>
      <Oraliqlar qiymat={oraliq} onChange={setOraliq} />
      {s === null ? (
        <p className="text-izoh text-matn-2">{t("Statistika uchun kamida ikki kunlik yozuv kerak.")}</p>
      ) : (
        <>
          <Bosh kaloriya={s.ortachaKaloriya} izoh={t("kkal — kunlik o'rtacha")} />
          <div className="flex flex-col gap-3">
            <MakroChizigi til={til} nomi="Oqsil" qiymat={s.ortachaOqsil} maqsad={norma.oqsil} />
            <MakroChizigi til={til} nomi="Yog'" qiymat={s.ortachaYog} maqsad={norma.yog} />
            <MakroChizigi til={til} nomi="Uglevod" qiymat={s.ortachaUglevod} maqsad={norma.uglevod} />
          </div>
          <Qatorlar
            qatorlar={[
              [t("Makro taqsimoti"), `${s.taqsimot.oqsil} / ${s.taqsimot.yog} / ${s.taqsimot.uglevod}%`],
              [t("Normaga mos kunlar"), t("{0} / {1}", s.normagaMos, s.kunlar)],
              [t("Normadan oshgan kunlar"), String(s.normadanOshgan)],
              [t("Eng past kun"), t("{0} kkal · {1}", raqam(s.engPast.kaloriya), sanaQisqa(s.engPast.sana))],
              [
                t("Eng baland kun"),
                t("{0} kkal · {1}", raqam(s.engBaland.kaloriya), sanaQisqa(s.engBaland.sana)),
              ],
              [t("Kuzatilgan kunlar"), `${s.kuzatilganUlush}%`],
              ...(s.ortachaScore === null
                ? []
                : [[t("O'rtacha Nutrition Score"), t("{0} / {1}", s.ortachaScore, 100)] as [string, string]]),
            ]}
          />
          <p className="text-belgi text-matn-2">
            {t("O'rtachalar faqat yozuv bor kunlardan olinadi — bo'sh kun nol deb hisoblanmaydi.")}
          </p>
        </>
      )}
    </div>
  );
}

// Ustunlar maydoni 72 px; yozuvli eng kichik ustun ham ko'rinsin (4 px), yozuvsiz kun — 2 px chiziq.
const USTUN_BALANDLIGI = 72;

function HaftalikKarta({ hisobot, normaKaloriya }: { hisobot: HaftalikHisobot | null; normaKaloriya: number }) {
  const { t, til } = useTarjima();
  if (hisobot === null) {
    return (
      <div className={KARTA}>
        <p className="text-izoh text-matn-2">{t("Hisobot uchun bu haftada kamida uch kunlik yozuv kerak.")}</p>
      </div>
    );
  }

  const eng = Math.max(normaKaloriya, ...hisobot.kunBoyicha.map((kun) => kun.kaloriya ?? 0));
  const farq = hisobot.farq;
  const belgi = farq === null ? "" : farq > 0 ? "+" : farq < 0 ? "−" : "";

  return (
    <div className={KARTA}>
      <Bosh
        kichik
        kaloriya={hisobot.ortachaKaloriya}
        izoh={t("kkal / kun")}
        qoshimcha={farq === null ? undefined : `${belgi}${t("{0} o'tgan haftaga nisbatan", raqam(Math.abs(farq)))}`}
      />
      <div className="flex h-[88px] items-end gap-2" aria-hidden="true">
        {hisobot.kunBoyicha.map((kun) => {
          const balandlik = kun.kaloriya
            ? Math.max(4, Math.round((kun.kaloriya / eng) * USTUN_BALANDLIGI))
            : 2;
          return (
            <span key={kun.sana} className="flex h-full min-w-0 flex-1 flex-col items-center gap-1">
              <span className="flex w-full flex-1 items-end">
                <span
                  className={`w-full rounded-chip ${kun.kaloriya ? "bg-aksent" : "bg-chegara"}`}
                  style={{ height: balandlik }}
                />
              </span>
              <span className="text-belgi text-matn-3">{haftaKuniNomi(kun.sana, til)}</span>
            </span>
          );
        })}
      </div>
      <Qatorlar
        qatorlar={[
          [t("Yozuv bor kunlar"), t("{0} / {1}", hisobot.kunlar, 7)],
          [t("Normaga mos kunlar"), t("{0} / {1}", hisobot.normagaMos, 7)],
          [t("O'rtacha oqsil"), t("{0} g", hisobot.ortachaOqsil)],
          ...(hisobot.ortachaScore === null
            ? []
            : [[t("O'rtacha Nutrition Score"), t("{0} / {1}", hisobot.ortachaScore, 100)] as [string, string]]),
        ]}
      />
    </div>
  );
}

/**
 * P1 dagi ikki PRO bo'lim (prototip `screens-progress.jsx`): batafsil statistika (7/30 kun)
 * va haftalik hisobot. FREE'da ikkalasi o'rnida qulf kartasi — raqamlar serverdan kelmaydi.
 */
export function OvqatStatistikasi({ statistika }: { statistika: Statistika }) {
  const { t } = useTarjima();

  if (statistika.yopiq) {
    return (
      <>
        <Bolim sarlavha="Batafsil ovqatlanish statistikasi">
          <ProQulfi
            sarlavha={t("Batafsil ovqatlanish statistikasi")}
            izoh={t("O'rtacha kaloriya, makro taqsimoti va normaga mos kunlar.")}
            tugma={t("PRO ni ochish")}
          />
        </Bolim>
        <Bolim sarlavha="Haftalik ovqatlanish hisoboti">
          <ProQulfi
            sarlavha={t("Haftalik ovqatlanish hisoboti")}
            izoh={t("Har hafta: o'rtacha kaloriya, oldingi hafta bilan solishtirish va kunlar bo'yicha ustunlar.")}
            tugma={t("PRO ni ochish")}
          />
        </Bolim>
      </>
    );
  }

  return (
    <>
      <Bolim sarlavha="Batafsil ovqatlanish statistikasi">
        <BatafsilKarta malumot={statistika.batafsil} norma={statistika.norma} />
      </Bolim>
      <Bolim sarlavha="Haftalik ovqatlanish hisoboti">
        <HaftalikKarta hisobot={statistika.haftalik} normaKaloriya={statistika.norma.kaloriya} />
      </Bolim>
    </>
  );
}
