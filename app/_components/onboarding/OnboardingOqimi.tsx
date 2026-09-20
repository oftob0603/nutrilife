"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Tugma } from "@/app/_components/Tugma";
import { OnboardingMaydoni } from "@/app/_components/onboarding/OnboardingMaydoni";
import { Variantlar } from "@/app/_components/onboarding/Variantlar";
import {
  afzallikBosildi,
  birlikOzgardi,
  formaYarat,
  qadamniTayyorla,
  type Forma,
  type QadamTekshiruvi,
} from "@/lib/services/onboarding-forma";
import {
  AFZALLIKLAR,
  FAOLLIKLAR,
  JINSLAR,
  JOYLAR,
  MAHALLAR,
  MAQSADLAR,
  MOTIVATSIYALAR,
  OTKAZILADIGAN_QADAMLAR,
  QADAMLAR_SONI,
  TILLAR,
  maqsadVaznKerakmi,
  type Birliklar,
  type OnboardingHolati,
} from "@/lib/services/onboarding-hisob";

const MAQSAD_QADAMI = 4;

const SAVOLLAR: Record<number, { savol: string; izoh?: string }> = {
  2: { savol: "Qaysi tilda davom etamiz?" },
  3: { savol: "Sizni qanday chaqiraylik?", izoh: "Bu faqat salomlashish uchun" },
  4: { savol: "Nimaga erishmoqchisiz?" },
  5: {
    savol: "Hisob to'g'ri chiqishi uchun bir-ikki raqam kerak",
    izoh: "Jins va yosh faqat kaloriya formulasi uchun ishlatiladi",
  },
  6: { savol: "Bo'yingiz va vazningiz?" },
  7: { savol: "Kuningiz qanday o'tadi?" },
  8: { savol: "Ovqatda cheklovingiz bormi?" },
  9: { savol: "Odatda qanday ovqatlanasiz?" },
  10: { savol: "Nima sizni harakatga undaydi?" },
};

type Saqlash =
  | { holat: "tinch" | "saqlanmoqda" | "xato" | "oflayn" }
  | { holat: "rad"; matn: string };

function OrqagaTugmasi({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Orqaga"
      className="-ml-3 flex size-11 shrink-0 items-center justify-center rounded-full text-siyoh active:scale-[0.98]"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

/** kg/lb va sm/ft almashtirgichi — tanlov `foydalanuvchilar.birliklar` ga yoziladi. */
function BirlikTanlagich({
  qiymat,
  onChange,
}: {
  qiymat: Birliklar;
  onChange: (birliklar: Birliklar) => void;
}) {
  const variantlar: { qiymat: Birliklar; nomi: string }[] = [
    { qiymat: "metrik", nomi: "kg · sm" },
    { qiymat: "imperial", nomi: "lb · ft" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="O'lchov birliklari"
      className="flex gap-1 self-start rounded-chip border border-chegara bg-fon p-1"
    >
      {variantlar.map((variant) => {
        const faol = variant.qiymat === qiymat;
        return (
          <button
            key={variant.qiymat}
            type="button"
            role="radio"
            aria-checked={faol}
            onClick={() => onChange(variant.qiymat)}
            className={`min-h-9 rounded-chip px-4 text-izoh transition-colors ${
              faol
                ? "bg-karta font-medium text-siyoh shadow-[inset_0_0_0_1px_var(--chegara)]"
                : "text-matn-2"
            }`}
          >
            {variant.nomi}
          </button>
        );
      })}
    </div>
  );
}

function Guruh({ sarlavha, children }: { sarlavha: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-izoh text-matn-2">{sarlavha}</h2>
      {children}
    </section>
  );
}

/** O1 — ilova nima qilishini aytadi. Shartlar katakchasi alohida taskda qo'shiladi. */
function Intro() {
  const qatorlar = [
    "Ovqatni rasmdan taniydi",
    "O'zbek taomlarini biladi",
    "Kunlik normangizni yig'ib boradi",
  ];
  return (
    <div className="flex flex-col gap-6 pt-6">
      <h1 className="font-display text-sarlavha">
        Ovqatingiz qancha kaloriya — rasmga oling, bilib oling
      </h1>
      <ul className="flex flex-col gap-3">
        {qatorlar.map((qator) => (
          <li key={qator} className="flex items-center gap-3 text-asosiy">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-siyoh" />
            {qator}
          </li>
        ))}
      </ul>
      <p className="text-izoh text-matn-2">Barcha raqamlar taxminiy. Ilova tibbiy xizmat emas.</p>
    </div>
  );
}

/** O6 — bo'y, joriy va maqsad vazn; tekshiruv izohlari har biri o'z maydoni ostida. */
function Olchovlar({
  forma,
  tekshiruv,
  onChange,
  onMaqsadgaQaytish,
}: {
  forma: Forma;
  tekshiruv: QadamTekshiruvi;
  onChange: (forma: Forma) => void;
  onMaqsadgaQaytish: () => void;
}) {
  const maqsadVaznRef = useRef<HTMLInputElement>(null);
  const imperial = forma.birliklar === "imperial";
  const vaznBirligi = imperial ? "lb" : "kg";
  const { xatolar, ogohlantirishlar, yonalishXatosi } = tekshiruv;

  return (
    <div className="flex flex-col gap-4">
      <BirlikTanlagich
        qiymat={forma.birliklar}
        onChange={(birliklar) => onChange(birlikOzgardi(forma, birliklar))}
      />

      {imperial ? (
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-3">
            <OnboardingMaydoni
              nomi="Bo'y"
              birlik="ft"
              turi="butun"
              qiymat={forma.boyiFt}
              xato={xatolar.boyi ? true : undefined}
              onChange={(boyiFt) => onChange({ ...forma, boyiFt })}
            />
            <OnboardingMaydoni
              nomi="Dyuym"
              birlik="in"
              turi="butun"
              qiymat={forma.boyiDyuym}
              xato={xatolar.boyi ? true : undefined}
              onChange={(boyiDyuym) => onChange({ ...forma, boyiDyuym })}
            />
          </div>
          {xatolar.boyi && <p className="text-izoh text-xato">{xatolar.boyi}</p>}
        </div>
      ) : (
        <OnboardingMaydoni
          nomi="Bo'y"
          birlik="sm"
          turi="butun"
          qiymat={forma.boyi}
          xato={xatolar.boyi}
          onChange={(boyi) => onChange({ ...forma, boyi })}
        />
      )}

      <OnboardingMaydoni
        nomi="Joriy vazn"
        birlik={vaznBirligi}
        qiymat={forma.vazn}
        xato={xatolar.vazn}
        ogohlantirish={ogohlantirishlar.vazn}
        onChange={(vazn) => onChange({ ...forma, vazn })}
      />

      {maqsadVaznKerakmi(forma.maqsad) && (
        <div className="flex flex-col gap-2">
          <OnboardingMaydoni
            nomi="Maqsad vazn"
            birlik={vaznBirligi}
            qiymat={forma.maqsadVazn}
            xato={xatolar.maqsadVazn ?? yonalishXatosi ?? undefined}
            ogohlantirish={
              ogohlantirishlar.yaqin
                ? "Bu maqsad joriy vaznga juda yaqin — «Vaznni saqlash» to'g'riroq bo'lishi mumkin"
                : ogohlantirishlar.maqsadVazn
            }
            inputRef={maqsadVaznRef}
            onChange={(maqsadVazn) => onChange({ ...forma, maqsadVazn })}
          />
          {(yonalishXatosi || ogohlantirishlar.yaqin) && (
            <div className="flex flex-wrap gap-x-4">
              {yonalishXatosi && (
                <button
                  type="button"
                  onClick={() => {
                    maqsadVaznRef.current?.focus();
                    maqsadVaznRef.current?.select();
                  }}
                  className="min-h-11 text-izoh font-medium text-siyoh underline underline-offset-4"
                >
                  Raqamni to&apos;g&apos;rilash
                </button>
              )}
              <button
                type="button"
                onClick={onMaqsadgaQaytish}
                className="min-h-11 text-izoh font-medium text-siyoh underline underline-offset-4"
              >
                Maqsadni o&apos;zgartirish
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * O1–O10 onboarding oqimi (onboarding-tz.md). Har javob "Davom etish" bosilganda darhol
 * saqlanadi; forma holati shu yerda turadi — orqaga qaytilganda va saqlash xatosida
 * kiritilgan javob yo'qolmaydi.
 */
export function OnboardingOqimi({ boshlangich }: { boshlangich: OnboardingHolati }) {
  const router = useRouter();
  const [qadam, setQadam] = useState(boshlangich.qadam);
  const [forma, setForma] = useState(() => formaYarat(boshlangich.javoblar));
  const [saqlash, setSaqlash] = useState<Saqlash>({ holat: "tinch" });

  const tekshiruv = qadamniTayyorla(qadam, forma);
  const otkazsaBoladi = OTKAZILADIGAN_QADAMLAR.includes(qadam);
  const band = saqlash.holat === "saqlanmoqda";

  function formaOzgardi(yangi: Forma) {
    setForma(yangi);
    if (saqlash.holat !== "tinch") setSaqlash({ holat: "tinch" });
  }

  function qadamgaOt(yangi: number) {
    setSaqlash({ holat: "tinch" });
    setQadam(yangi);
    window.scrollTo(0, 0);
  }

  async function yubor(tana: Record<string, unknown>) {
    if (!window.navigator.onLine) {
      setSaqlash({ holat: "oflayn" });
      return;
    }
    setSaqlash({ holat: "saqlanmoqda" });
    try {
      const javob = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tana),
      });
      if (javob.status === 400) {
        const { xato } = (await javob.json()) as { xato?: string };
        setSaqlash({ holat: "rad", matn: xato ?? "Javob qabul qilinmadi" });
        return;
      }
      if (!javob.ok) {
        setSaqlash({ holat: "xato" });
        return;
      }
      if (qadam === QADAMLAR_SONI) {
        // Tugma Home ochilguncha band turadi.
        router.replace("/");
        return;
      }
      qadamgaOt(qadam + 1);
    } catch {
      setSaqlash({ holat: "xato" });
    }
  }

  const savol = SAVOLLAR[qadam];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4">
      <header className="flex min-h-13 items-center gap-3 pt-2">
        {qadam > 1 ? (
          <OrqagaTugmasi onClick={() => !band && qadamgaOt(qadam - 1)} />
        ) : (
          <span className="size-2" />
        )}
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={QADAMLAR_SONI}
          aria-valuenow={qadam}
          aria-label="Onboarding bosqichi"
          className="h-1 flex-1 overflow-hidden rounded-full bg-chegara"
        >
          <div
            className="h-full rounded-full bg-siyoh transition-[width] duration-[250ms]"
            style={{ width: `${(qadam / QADAMLAR_SONI) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-izoh tabular-nums text-matn-2">
          {QADAMLAR_SONI} dan {qadam}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-6 pb-6 pt-4">
        {savol && (
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-sarlavha">{savol.savol}</h1>
            {savol.izoh && <p className="text-izoh text-matn-2">{savol.izoh}</p>}
          </div>
        )}

        {qadam === 1 && <Intro />}

        {qadam === 2 && (
          <Variantlar
            nomi="Til"
            variantlar={TILLAR}
            tanlangan={[forma.til]}
            onTanla={(til) => formaOzgardi({ ...forma, til })}
          />
        )}

        {qadam === 3 && (
          <OnboardingMaydoni
            nomi="Ism"
            turi="matn"
            qiymat={forma.ism}
            xato={tekshiruv.xatolar.ism}
            onChange={(ism) => formaOzgardi({ ...forma, ism })}
          />
        )}

        {qadam === 4 && (
          <Variantlar
            nomi="Asosiy maqsad"
            variantlar={MAQSADLAR}
            tanlangan={forma.maqsad ? [forma.maqsad] : []}
            onTanla={(maqsad) => formaOzgardi({ ...forma, maqsad })}
          />
        )}

        {qadam === 5 && (
          <>
            <Guruh sarlavha="Jins">
              <Variantlar
                nomi="Jins"
                variantlar={JINSLAR}
                tanlangan={forma.jins ? [forma.jins] : []}
                onTanla={(jins) => formaOzgardi({ ...forma, jins })}
              />
            </Guruh>
            <OnboardingMaydoni
              nomi="Yosh"
              turi="butun"
              qiymat={forma.yosh}
              xato={tekshiruv.xatolar.yosh}
              onChange={(yosh) => formaOzgardi({ ...forma, yosh })}
            />
          </>
        )}

        {qadam === 6 && (
          <Olchovlar
            forma={forma}
            tekshiruv={tekshiruv}
            onChange={formaOzgardi}
            onMaqsadgaQaytish={() => qadamgaOt(MAQSAD_QADAMI)}
          />
        )}

        {qadam === 7 && (
          <Variantlar
            nomi="Faollik darajasi"
            variantlar={FAOLLIKLAR}
            tanlangan={forma.faollik ? [forma.faollik] : []}
            onTanla={(faollik) => formaOzgardi({ ...forma, faollik })}
          />
        )}

        {qadam === 8 && (
          <Variantlar
            nomi="Ovqat afzalliklari"
            kop
            variantlar={AFZALLIKLAR}
            tanlangan={forma.ovqatAfzalliklari}
            onTanla={(qiymat) =>
              formaOzgardi({
                ...forma,
                ovqatAfzalliklari: afzallikBosildi(forma.ovqatAfzalliklari, qiymat),
              })
            }
          />
        )}

        {qadam === 9 && (
          <>
            <Guruh sarlavha="Kuniga necha mahal">
              <Variantlar
                nomi="Kuniga necha mahal"
                variantlar={MAHALLAR}
                tanlangan={forma.mahal ? [forma.mahal] : []}
                onTanla={(mahal) => formaOzgardi({ ...forma, mahal })}
              />
            </Guruh>
            <Guruh sarlavha="Asosan qayerda">
              <Variantlar
                nomi="Asosan qayerda"
                variantlar={JOYLAR}
                tanlangan={forma.joy ? [forma.joy] : []}
                onTanla={(joy) => formaOzgardi({ ...forma, joy })}
              />
            </Guruh>
          </>
        )}

        {qadam === 10 && (
          <Variantlar
            nomi="Motivatsiya"
            variantlar={MOTIVATSIYALAR}
            tanlangan={forma.motivatsiya ? [forma.motivatsiya] : []}
            onTanla={(motivatsiya) => formaOzgardi({ ...forma, motivatsiya })}
          />
        )}
      </div>

      <footer className="sticky bottom-0 flex flex-col gap-2 bg-fon pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
        {saqlash.holat !== "tinch" && saqlash.holat !== "saqlanmoqda" && (
          <p role="alert" className="text-center text-izoh text-xato">
            {saqlash.holat === "oflayn"
              ? "Internet yo'q. Ulanishni tekshiring"
              : saqlash.holat === "rad"
                ? saqlash.matn
                : "Saqlanmadi. Qayta urinib ko'ring"}
          </p>
        )}
        <Tugma
          yuklanmoqda={band}
          disabled={!tekshiruv.tana}
          onClick={() => tekshiruv.tana && void yubor(tekshiruv.tana)}
        >
          {qadam === 1 ? "Boshlash" : qadam === QADAMLAR_SONI ? "Tugatish" : "Davom etish"}
        </Tugma>
        {otkazsaBoladi && (
          <Tugma
            korinish="uchinchi"
            disabled={band}
            onClick={() => void yubor({ qadam, otkazildi: true })}
          >
            O&apos;tkazib yuborish
          </Tugma>
        )}
      </footer>
    </main>
  );
}
