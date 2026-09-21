"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tugma } from "@/app/_components/Tugma";
import { Gildirak, GildirakMaydoni } from "@/app/_components/onboarding/Gildirak";
import { OnboardingMaydoni } from "@/app/_components/onboarding/OnboardingMaydoni";
import { SegmentTanlagich, Variantlar } from "@/app/_components/onboarding/Variantlar";
import { apiSorov } from "@/lib/services/api-klient";
import {
  afzallikBosildi,
  formaYarat,
  qadamniTayyorla,
  type Forma,
  type QadamTekshiruvi,
} from "@/lib/services/onboarding-forma";
import {
  AFZALLIKLAR,
  BOY,
  FAOLLIKLAR,
  JINSLAR,
  JOYLAR,
  MAHALLAR,
  MAQSAD_QADAMI,
  MAQSADLAR,
  MOTIVATSIYALAR,
  OTKAZILADIGAN_QADAMLAR,
  QADAMLAR_SONI,
  VAZN,
  ftdanSm,
  kgdanLb,
  lbdanKg,
  maqsadVaznKerakmi,
  smdanFt,
  type Birliklar,
  type OnboardingHolati,
} from "@/lib/services/onboarding-hisob";

const SAVOLLAR: Record<number, { savol: string; izoh?: string }> = {
  2: { savol: "Sizni qanday chaqiraylik?" },
  3: { savol: "Nimaga erishmoqchisiz?" },
  4: { savol: "Hisob to'g'ri chiqishi uchun bir-ikki raqam kerak" },
  5: { savol: "Bo'yingiz va vazningiz?" },
  6: { savol: "Kuningiz qanday o'tadi?" },
  7: {
    savol: "Ovqatda cheklovingiz bormi?",
    izoh: "Bu normaga ta'sir qilmaydi — taom takliflari va retseptlar uchun.",
  },
  8: { savol: "Odatda qanday ovqatlanasiz?" },
  9: {
    savol: "Nima sizni harakatga undaydi?",
    izoh: "Eslatma va matnlarni shunga qarab tanlaymiz.",
  },
};

const BIRLIK_VARIANTLARI: { qiymat: Birliklar; nomi: string }[] = [
  { qiymat: "metrik", nomi: "kg · sm" },
  { qiymat: "imperial", nomi: "lb · ft" },
];

type Saqlash =
  | { holat: "tinch" | "saqlanmoqda" | "xato" | "oflayn" }
  | { holat: "rad"; matn: string };

function saqlashMatni(saqlash: Saqlash): string | null {
  switch (saqlash.holat) {
    case "oflayn":
      return "Internet yo'q. Ulanishni tekshiring";
    case "rad":
      return saqlash.matn;
    case "xato":
      return "Saqlanmadi. Qayta urinib ko'ring";
    default:
      return null;
  }
}

// ---------- G'ildirak qiymatlari ----------

type Oraliq = { min: number; max: number; qadam: number; kasr: number };

/** Butun sonli hisob: 0,1 ni yuzlab marta qo'shish kasr xatosini to'playdi. */
function qiymatlar({ min, max, qadam, kasr }: Oraliq): string[] {
  const soni = Math.round((max - min) / qadam);
  return Array.from({ length: soni + 1 }, (_, i) => (min + i * qadam).toFixed(kasr));
}

/** Qiymat qadam to'riga tushmasa ham (69,9 kg yarim kilolik g'ildirakda) eng yaqin indeks olinadi. */
function indeks(qiymat: number | null, { min, max, qadam }: Oraliq): number {
  if (qiymat === null) return -1;
  const oxirgi = Math.round((max - min) / qadam);
  return Math.max(0, Math.min(oxirgi, Math.round((qiymat - min) / qadam)));
}

const YOSH_ORALIGI: Oraliq = { min: 13, max: 100, qadam: 1, kasr: 0 };
const ORALIQLAR: Record<Birliklar, { boy: Oraliq; vazn: Oraliq }> = {
  metrik: {
    boy: { min: BOY.min, max: BOY.max, qadam: 1, kasr: 0 },
    vazn: { min: VAZN.min, max: VAZN.max, qadam: 0.5, kasr: 1 },
  },
  imperial: {
    boy: { min: 3.9, max: 7.6, qadam: 0.1, kasr: 1 },
    vazn: { min: 66, max: 660, qadam: 1, kasr: 0 },
  },
};

const YOSHLAR = qiymatlar(YOSH_ORALIGI);
const QIYMATLAR: Record<Birliklar, { boy: string[]; vazn: string[] }> = {
  metrik: { boy: qiymatlar(ORALIQLAR.metrik.boy), vazn: qiymatlar(ORALIQLAR.metrik.vazn) },
  imperial: { boy: qiymatlar(ORALIQLAR.imperial.boy), vazn: qiymatlar(ORALIQLAR.imperial.vazn) },
};

/** Tanlanmagan g'ildirak turadigan joy: 170 sm va 70 kg. */
const BOSHLANGICH = { boyi: 170, vazn: 70 };

// ---------- Bo'laklar ----------

function Guruh({ sarlavha, children }: { sarlavha: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-izoh text-matn-2">{sarlavha}</h2>
      {children}
    </section>
  );
}

/** Prototipdagi StepProgress: orqaga · "9 dan 3" · (o'tkazib yuborish), ostida progress chizig'i. */
function QadamSarlavhasi({
  qadam,
  onOrqaga,
  onOtkazish,
}: {
  qadam: number;
  onOrqaga: () => void;
  onOtkazish?: () => void;
}) {
  return (
    <header className="flex flex-col gap-2 px-4 pb-3 pt-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOrqaga}
          aria-label="Orqaga"
          className="-ml-3 flex size-11 shrink-0 items-center justify-center text-siyoh active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="flex-1 text-izoh tabular-nums text-matn-2">
          {QADAMLAR_SONI} dan {qadam}
        </span>
        {onOtkazish && (
          <button
            type="button"
            onClick={onOtkazish}
            className="-mr-2 min-h-11 px-2 text-izoh text-matn-2 active:scale-[0.98]"
          >
            O&apos;tkazib yuborish
          </button>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={QADAMLAR_SONI}
        aria-valuenow={qadam}
        aria-label="Onboarding bosqichi"
        className="h-1 overflow-hidden rounded-full bg-chegara"
      >
        <div
          className="h-full rounded-full bg-siyoh transition-[width] duration-[250ms]"
          style={{ width: `${(qadam / QADAMLAR_SONI) * 100}%` }}
        />
      </div>
    </header>
  );
}

/**
 * 1-qadam — to'liq ekranli poster va pastki panel (prototip O1). "Boshlash"ni bosish
 * shartlarni qabul qilish hisoblanadi; havola loyiha oxirida qo'shiladi. Ranglar — faqat
 * shu ekranga tegishli `o1-*` tokenlari (DESIGN.md, 1-bo'lim).
 */
function Intro({
  band,
  xato,
  onBoshlash,
}: {
  band: boolean;
  xato: string | null;
  onBoshlash: () => void;
}) {
  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden bg-o1-fon">
      <Image
        src="/onboarding/intro.png"
        alt="Ozish, vazn olish, sog'lom turmush tarzi va vaznni saqlash"
        fill
        priority
        sizes="(max-width: 448px) 100vw, 448px"
        className="object-contain object-top"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 rounded-t-[32px] border-t border-o1-chegara bg-o1-panel px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 text-o1-matn shadow-[0_-2px_32px_rgba(11,11,12,0.14)]">
        <div className="flex flex-col gap-2">
          <span className="font-display text-karta-sarlavha text-o1-matn-2">NutriLife</span>
          <h1 className="font-display text-sarlavha">
            Taomingiz haqida ko&apos;proq bilishni xohlaysizmi?
          </h1>
        </div>
        {xato && (
          <p role="alert" className="text-center text-izoh text-xato">
            {xato}
          </p>
        )}
        <p className="text-center text-izoh text-o1-matn-2">
          «Boshlash»ni bosish orqali Ommaviy oferta shartlarini qabul qilasiz.
        </p>
        <div className="rounded-full shadow-[0_1px_2px_rgba(21,128,61,0.18),0_4px_12px_rgba(21,128,61,0.16)]">
          <Tugma korinish="aksent" yuklanmoqda={band} onClick={onBoshlash}>
            Boshlash
          </Tugma>
        </div>
      </div>
    </main>
  );
}

/** 5-qadam — bo'y, joriy va maqsad vazn g'ildiraklari; izohlar har biri o'z maydoni ostida. */
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
  const { birliklar } = forma;
  const metrik = birliklar === "metrik";
  const oraliq = ORALIQLAR[birliklar];
  const royxat = QIYMATLAR[birliklar];
  const { olchov } = tekshiruv;

  // Holat doim sm/kg; g'ildirak boshqa birlikni faqat ko'rsatadi.
  const boyKorinishi = (sm: number) => (metrik ? sm : smdanFt(sm));
  const vaznKorinishi = (kg: number) => (metrik ? kg : kgdanLb(kg));
  const boyniOl = (i: number) => (metrik ? Number(royxat.boy[i]) : ftdanSm(Number(royxat.boy[i])));
  const vaznniOl = (i: number) => (metrik ? Number(royxat.vazn[i]) : lbdanKg(Number(royxat.vazn[i])));
  const vaznIndeksi = (kg: number | null) =>
    indeks(kg === null ? null : vaznKorinishi(kg), oraliq.vazn);

  const vaznBirligi = metrik ? "kg" : "lb";
  const havola = "min-h-11 text-izoh font-medium text-siyoh underline underline-offset-4";

  return (
    <>
      <SegmentTanlagich
        nomi="O'lchov birliklari"
        variantlar={BIRLIK_VARIANTLARI}
        tanlangan={birliklar}
        onTanla={(qiymat) => onChange({ ...forma, birliklar: qiymat as Birliklar })}
      />

      {/* `key`: birlik almashganda qiymatlar ro'yxati butunlay boshqa — g'ildirak qaytadan joylashadi. */}
      <GildirakMaydoni nomi="Bo'y" birlik={metrik ? "sm" : "ft"}>
        <Gildirak
          key={birliklar}
          nomi="Bo'y"
          yonalish="yotiq"
          qiymatlar={royxat.boy}
          tanlangan={indeks(forma.boyi === null ? null : boyKorinishi(forma.boyi), oraliq.boy)}
          boshlangich={indeks(boyKorinishi(BOSHLANGICH.boyi), oraliq.boy)}
          onTanla={(i) => onChange({ ...forma, boyi: boyniOl(i) })}
        />
      </GildirakMaydoni>

      <GildirakMaydoni nomi="Joriy vazn" birlik={vaznBirligi} ogohlantirish={olchov.vazn}>
        <Gildirak
          key={birliklar}
          nomi="Joriy vazn"
          yonalish="yotiq"
          qiymatlar={royxat.vazn}
          tanlangan={vaznIndeksi(forma.vazn)}
          boshlangich={vaznIndeksi(BOSHLANGICH.vazn)}
          onTanla={(i) => onChange({ ...forma, vazn: vaznniOl(i) })}
        />
      </GildirakMaydoni>

      {maqsadVaznKerakmi(forma.maqsad) && (
        <GildirakMaydoni
          nomi="Maqsad vazn"
          birlik={vaznBirligi}
          xato={olchov.yonalish}
          ogohlantirish={olchov.maqsadVazn}
          amallar={
            (olchov.yonalish || olchov.yaqin) && (
              <div className="flex flex-wrap gap-x-4">
                {olchov.yonalish && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...forma, maqsadVazn: null })}
                    className={havola}
                  >
                    Raqamni to&apos;g&apos;rilash
                  </button>
                )}
                <button type="button" onClick={onMaqsadgaQaytish} className={havola}>
                  Maqsadni o&apos;zgartirish
                </button>
              </div>
            )
          }
        >
          <Gildirak
            key={birliklar}
            nomi="Maqsad vazn"
            yonalish="yotiq"
            qiymatlar={royxat.vazn}
            tanlangan={vaznIndeksi(forma.maqsadVazn)}
            boshlangich={vaznIndeksi(forma.vazn ?? BOSHLANGICH.vazn)}
            onTanla={(i) => onChange({ ...forma, maqsadVazn: vaznniOl(i) })}
          />
        </GildirakMaydoni>
      )}
    </>
  );
}

/**
 * Onboarding oqimi (onboarding-tz.md; ko'rinish — prototip/ui_kits/onboarding). Har javob
 * "Davom etish" bosilganda darhol saqlanadi; forma holati shu yerda turadi — orqaga
 * qaytilganda va saqlash xatosida kiritilgan javob yo'qolmaydi.
 */
export function OnboardingOqimi({ boshlangich }: { boshlangich: OnboardingHolati }) {
  const router = useRouter();
  const [qadam, setQadam] = useState(boshlangich.qadam);
  const [forma, setForma] = useState(() => formaYarat(boshlangich.javoblar));
  const [saqlash, setSaqlash] = useState<Saqlash>({ holat: "tinch" });

  const tekshiruv = qadamniTayyorla(qadam, forma);
  const otkazsaBoladi = OTKAZILADIGAN_QADAMLAR.includes(qadam);
  const band = saqlash.holat === "saqlanmoqda";
  const xatoMatni = saqlashMatni(saqlash);

  function formaOzgardi(yangi: Forma) {
    setForma(yangi);
    if (saqlash.holat !== "tinch" && !band) setSaqlash({ holat: "tinch" });
  }

  function qadamgaOt(yangi: number) {
    setSaqlash({ holat: "tinch" });
    setQadam(yangi);
    window.scrollTo(0, 0);
  }

  async function yubor(tana: Record<string, unknown>) {
    if (band) return;
    if (!window.navigator.onLine) {
      setSaqlash({ holat: "oflayn" });
      return;
    }
    setSaqlash({ holat: "saqlanmoqda" });
    try {
      const javob = await apiSorov("/api/onboarding", {
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

  if (qadam === 1) {
    return <Intro band={band} xato={xatoMatni} onBoshlash={() => void yubor({ qadam: 1 })} />;
  }

  const savol = SAVOLLAR[qadam];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <QadamSarlavhasi
        qadam={qadam}
        onOrqaga={() => !band && qadamgaOt(qadam - 1)}
        onOtkazish={otkazsaBoladi ? () => void yubor({ qadam, otkazildi: true }) : undefined}
      />

      <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-sarlavha">{savol.savol}</h1>
          {savol.izoh && <p className="text-asosiy text-matn-2">{savol.izoh}</p>}
        </div>

        {qadam === 2 && (
          <>
            <OnboardingMaydoni
              nomi="Ism"
              turi="matn"
              qiymat={forma.ism}
              xato={tekshiruv.ismXatosi}
              onChange={(ism) => formaOzgardi({ ...forma, ism })}
            />
            <p className="text-izoh text-matn-2">Bu faqat salomlashish uchun</p>
          </>
        )}

        {qadam === 3 && (
          <Variantlar
            nomi="Asosiy maqsad"
            variantlar={MAQSADLAR}
            tanlangan={forma.maqsad ? [forma.maqsad] : []}
            onTanla={(maqsad) => formaOzgardi({ ...forma, maqsad })}
          />
        )}

        {qadam === 4 && (
          <>
            <Guruh sarlavha="Jins">
              <Variantlar
                nomi="Jins"
                variantlar={JINSLAR}
                tanlangan={forma.jins ? [forma.jins] : []}
                onTanla={(jins) => formaOzgardi({ ...forma, jins })}
              />
            </Guruh>
            <GildirakMaydoni nomi="Yosh" xato={tekshiruv.yoshXatosi}>
              <Gildirak
                nomi="Yosh"
                yonalish="tik"
                qiymatlar={YOSHLAR}
                tanlangan={indeks(forma.yosh, YOSH_ORALIGI)}
                boshlangich={indeks(forma.yosh, YOSH_ORALIGI)}
                onTanla={(i) => formaOzgardi({ ...forma, yosh: Number(YOSHLAR[i]) })}
              />
            </GildirakMaydoni>
            <p className="text-izoh text-matn-2">
              Jins va yosh faqat kaloriya formulasi uchun ishlatiladi
            </p>
          </>
        )}

        {qadam === 5 && (
          <Olchovlar
            forma={forma}
            tekshiruv={tekshiruv}
            onChange={formaOzgardi}
            onMaqsadgaQaytish={() => qadamgaOt(MAQSAD_QADAMI)}
          />
        )}

        {qadam === 6 && (
          <Variantlar
            nomi="Faollik darajasi"
            variantlar={FAOLLIKLAR}
            tanlangan={forma.faollik ? [forma.faollik] : []}
            onTanla={(faollik) => formaOzgardi({ ...forma, faollik })}
          />
        )}

        {qadam === 7 && (
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

        {qadam === 8 && (
          <>
            <Guruh sarlavha="Kuniga necha mahal">
              <SegmentTanlagich
                nomi="Kuniga necha mahal"
                variantlar={MAHALLAR}
                tanlangan={forma.mahal}
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

        {qadam === 9 && (
          <Variantlar
            nomi="Motivatsiya"
            variantlar={MOTIVATSIYALAR}
            tanlangan={forma.motivatsiya ? [forma.motivatsiya] : []}
            onTanla={(motivatsiya) => formaOzgardi({ ...forma, motivatsiya })}
          />
        )}
      </div>

      <footer className="sticky bottom-0 flex flex-col border-t border-chegara bg-fon">
        {xatoMatni && (
          <p role="alert" className="border-b border-xato bg-karta px-4 py-3 text-izoh text-xato">
            {xatoMatni}
          </p>
        )}
        <div className="px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-3">
          <Tugma
            yuklanmoqda={band}
            disabled={!tekshiruv.tana}
            onClick={() => tekshiruv.tana && void yubor(tekshiruv.tana)}
          >
            {qadam === QADAMLAR_SONI ? "Tugatish" : "Davom etish"}
          </Tugma>
        </div>
      </footer>
    </main>
  );
}
