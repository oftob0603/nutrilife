"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  birlamchiPorsiya,
  porsiyaHisobi,
  raqam,
  taomNomi,
  type Taom,
} from "@/lib/services/taom-hisob";
import { porsiyaTavsiyasi } from "@/lib/services/taklif-hisob";
import {
  KALORIYA_CHEGARASI,
  MAKRO_CHEGARASI,
  miqdorChegarasi,
  miqdorYaroqli,
} from "@/lib/services/yozuv-chegaralari";
import { sonOqi } from "@/lib/services/yozuv-forma";
import { OVQAT_TURLARI, type OvqatTuri } from "@/lib/services/yozuv-hisob";
import type { Kalit } from "@/lib/lugat/tarjima";
import { apiSorov } from "@/lib/services/api-klient";
import { OvqatTuriTanlagich } from "@/app/_components/OvqatTuriTanlagich";
import { ProQulfi } from "@/app/_components/ProQulfi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";

/** Tavsiya uchun asos: bugun qolgan kaloriya va imkoniyat PRO'ga yopiqmi (E5 sahifasi yuklaydi). */
export type TavsiyaAsosi = { qoldi: number; yopiq: boolean };

function TaroziIkonasi() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-matn-2"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function OngStrelka() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-matn-3"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Chip({
  tanlangan,
  onClick,
  children,
}: {
  tanlangan: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={tanlangan}
      className={`min-h-11 rounded-chip border px-4 text-asosiy font-medium tabular-nums transition-colors ${
        tanlangan
          ? "border-siyoh bg-siyoh text-fon"
          : "border-chegara bg-karta text-siyoh"
      }`}
    >
      {children}
    </button>
  );
}

function Makro({ nomi, qiymat }: { nomi: Kalit; qiymat: number }) {
  const { t } = useTarjima();
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-izoh text-matn-2">{t(nomi)}</span>
      <span className="text-asosiy tabular-nums">{t("{0} g", qiymat)}</span>
    </div>
  );
}

export function PorsiyaTanlagich({
  taom,
  tavsiyaAsosi = null,
}: {
  taom: Taom;
  /** Asos yo'q (yuklanmadi) — tavsiya kartasi ham, qulf ham chiqmaydi. */
  tavsiyaAsosi?: TavsiyaAsosi | null;
}) {
  const router = useRouter();
  const { t, til, erkin, miqdor: miqdorMatni } = useTarjima();
  // Porsiya tavsiyasi (PRO): Home doirasidagi "qoldi" bilan bir manbadan, hisob sof modulda.
  const tavsiya =
    tavsiyaAsosi && !tavsiyaAsosi.yopiq ? porsiyaTavsiyasi(taom, tavsiyaAsosi.qoldi) : null;
  const qolganKkal = tavsiyaAsosi ? raqam(tavsiyaAsosi.qoldi) : "";
  const [porsiya, setPorsiya] = useState(() => birlamchiPorsiya(taom));
  const [boshqa, setBoshqa] = useState("");
  const [ovqatTuri, setOvqatTuri] = useState<OvqatTuri>(OVQAT_TURLARI[1]);
  const [saqlanmoqda, setSaqlanmoqda] = useState(false);
  const [xato, setXato] = useState(false);

  // "Boshqa" to'ldirilgan bo'lsa chip emas, shu son olinadi; chegaralar server bilan bir manbadan.
  const kiritilgan = boshqa.trim() ? sonOqi(boshqa) : null;
  const miqdor = boshqa.trim() ? (kiritilgan ?? 0) : porsiya;
  const miqdorYaroqsiz = !miqdorYaroqli(miqdor, taom.olchovBirligi);
  const hisob = porsiyaHisobi(taom, miqdorYaroqsiz ? 0 : miqdor);
  // Miqdor joyida bo'lsa ham, kaloriyali taomning katta porsiyasi yozuv chegarasidan oshishi mumkin.
  const miqdorXatosi = miqdorYaroqsiz
    ? miqdor > miqdorChegarasi(taom.olchovBirligi)
      ? t("{0} dan oshmasin", miqdorChegarasi(taom.olchovBirligi))
      : t("Miqdor 0 dan katta bo'lishi kerak")
    : hisob.kaloriya > KALORIYA_CHEGARASI
      ? t("Bitta yozuv {0} kkal dan oshmasin", raqam(KALORIYA_CHEGARASI))
      : Math.max(hisob.oqsil, hisob.yog, hisob.uglevod) > MAKRO_CHEGARASI
        ? t("Oqsil, yog' yoki uglevod {0} g dan oshmasin", MAKRO_CHEGARASI)
        : null;
  const yaroqsiz = miqdorXatosi !== null;
  const birlik = erkin(taom.olchovBirligi);

  async function jurnalgaQosh() {
    setSaqlanmoqda(true);
    setXato(false);
    try {
      const javob = await apiSorov("/api/ovqat-yozuvlari", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taomId: taom.id,
          // Yozuv foydalanuvchi ko'rib turgan nom bilan saqlanadi — AI skan ham shu tilda yozadi.
          taomNomi: taomNomi(taom, til),
          porsiya: hisob.belgisi,
          kaloriya: hisob.kaloriya,
          oqsil: hisob.oqsil,
          yog: hisob.yog,
          uglevod: hisob.uglevod,
          ovqatTuri,
        }),
      });
      if (!javob.ok) throw new Error("Saqlanmadi");
      const { yozuv } = (await javob.json()) as { yozuv: { id: string } };
      router.push(`/qoshildi/${yozuv.id}`);
    } catch {
      // Kiritilgan ma'lumot joyida qoladi, ekran yopilmaydi (dizayn-tz E5).
      setXato(true);
      setSaqlanmoqda(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1">
        <span className="font-display text-raqam tabular-nums">
          {miqdorYaroqsiz ? "—" : raqam(hisob.kaloriya)}
        </span>
        <span className="text-izoh text-matn-2 tabular-nums">
          {miqdorYaroqsiz ? t("kkal") : t("kkal · {0}", miqdorMatni(miqdor, taom.olchovBirligi))}
        </span>
      </div>

      <div className="flex gap-4">
        <Makro nomi="Oqsil" qiymat={hisob.oqsil} />
        <Makro nomi="Yog'" qiymat={hisob.yog} />
        <Makro nomi="Uglevod" qiymat={hisob.uglevod} />
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-karta-sarlavha">{t("Porsiya")}</h2>
        <div className="flex flex-wrap gap-2">
          {taom.porsiyalar.map((variant) => (
            <Chip
              key={variant}
              tanlangan={!boshqa && porsiya === variant}
              onClick={() => {
                setBoshqa("");
                setPorsiya(variant);
              }}
            >
              {miqdorMatni(variant, taom.olchovBirligi)}
            </Chip>
          ))}
          {/* Uzun birlik ("шампур", "skewer") yonida "Boshqa" yozuvi qirqilmasin. */}
          <label
            className={`flex min-h-11 items-center gap-2 rounded-chip border bg-karta px-4 ${
              miqdorXatosi ? "border-xato" : "border-chegara"
            } ${birlik.length > 3 ? "w-44" : "w-32"}`}
          >
            <span className="sr-only">{t("Boshqa miqdor")}</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={boshqa}
              aria-invalid={miqdorXatosi ? true : undefined}
              aria-describedby={miqdorXatosi ? "boshqa-xato" : undefined}
              onChange={(hodisa) => setBoshqa(hodisa.target.value)}
              placeholder={t("Boshqa")}
              className="w-full min-w-0 bg-transparent text-asosiy tabular-nums outline-none placeholder:text-matn-3"
            />
            <span className="shrink-0 text-izoh text-matn-2">
              {birlik}
            </span>
          </label>
        </div>
        {miqdorXatosi && (
          <p id="boshqa-xato" role="alert" className="text-izoh text-xato">
            {miqdorXatosi}
          </p>
        )}
        {tavsiyaAsosi?.yopiq && (
          <ProQulfi zich sarlavha={t("Aqlli porsiya tavsiyalari — PRO")} />
        )}
        {tavsiya && (
          // Prototip `FoodScreen` dagi tavsiya kartasi: bosilsa miqdor tanlanadi. Tavsiya
          // standart chiplardan biri bo'lmasa (masalan 230 g) "Boshqa" maydoniga yoziladi —
          // prototipda bunday tanlov ko'rinmay qolardi.
          <button
            type="button"
            onClick={() => {
              if (taom.porsiyalar.includes(tavsiya.miqdor)) {
                setBoshqa("");
                setPorsiya(tavsiya.miqdor);
              } else {
                setBoshqa(String(tavsiya.miqdor));
              }
            }}
            className="flex min-h-11 items-center gap-3 rounded-karta border border-karta-chegara bg-karta p-4 text-left transition-transform active:scale-[0.98]"
          >
            <TaroziIkonasi />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-karta-sarlavha tabular-nums">
                {t("Tavsiya: {0}", miqdorMatni(tavsiya.miqdor, taom.olchovBirligi))}
              </span>
              <span className="text-izoh text-matn-2 tabular-nums">
                {tavsiya.chegaralangan
                  ? t(
                      "{0} kkal — odatdagi katta porsiya, qolgan {1} kkal ichida",
                      raqam(tavsiya.kaloriya),
                      qolganKkal,
                    )
                  : t("{0} kkal — qolgan {1} kkal ichida", raqam(tavsiya.kaloriya), qolganKkal)}
              </span>
            </span>
            <OngStrelka />
          </button>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-karta-sarlavha">{t("Ovqat turi")}</h2>
        <OvqatTuriTanlagich qiymat={ovqatTuri} onChange={setOvqatTuri} />
      </section>

      <Tugma yuklanmoqda={saqlanmoqda} disabled={yaroqsiz} onClick={jurnalgaQosh}>
        {t("Jurnalga qo'shish")}
      </Tugma>

      {xato && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-karta border border-xato p-4"
        >
          <p className="flex-1 text-asosiy text-xato">
            {t("Saqlanmadi. Qayta urinib ko'ring")}
          </p>
          <button
            type="button"
            onClick={jurnalgaQosh}
            className="min-h-11 rounded-chip px-4 text-asosiy font-medium text-siyoh"
          >
            {t("Qayta urinish")}
          </button>
        </div>
      )}
    </div>
  );
}
