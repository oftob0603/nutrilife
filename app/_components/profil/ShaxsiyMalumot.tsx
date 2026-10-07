"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingMaydoni } from "@/app/_components/onboarding/OnboardingMaydoni";
import { SegmentTanlagich, Variantlar } from "@/app/_components/onboarding/Variantlar";
import { PastkiVaraq } from "@/app/_components/PastkiVaraq";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { apiSorov } from "@/lib/services/api-klient";
import { afzallikBosildi } from "@/lib/services/onboarding-forma";
import {
  AFZALLIKLAR,
  FAOLLIKLAR,
  ISM_CHEGARASI,
  JINSLAR,
  JOYLAR,
  MAHALLAR,
  MAQSADLAR,
  YOSH_OGOHLANTIRISH_YOSHI,
  YOSH_XATOSI,
} from "@/lib/services/onboarding-hisob";
import type { Profil } from "@/lib/services/profil-hisob";
import { raqam } from "@/lib/services/raqam";
import {
  shaxsiyFormaYarat,
  shaxsiyniTayyorla,
  type MaydonXatosi,
} from "@/lib/services/shaxsiy-hisob";
import { OrqagaSarlavha } from "./OrqagaSarlavha";
import { SozlamaQatori } from "./SozlamaQatori";

// Bu ekranda variantlar tavsifsiz (prototip) — tavsif faqat onboardingda.
const nomlari = (royxat: readonly { qiymat: string; nomi: string }[]) =>
  royxat.map(({ qiymat, nomi }) => ({ qiymat, nomi }));

// Segmentga sig'ishi uchun uchinchi variant qisqa yoziladi (prototip: "Aytmayman").
const JINS_VARIANTLARI = JINSLAR.map(({ qiymat, nomi }) => ({
  qiymat,
  nomi: qiymat === "aytilmagan" ? "Aytmayman" : nomi,
}));

function Bolim({ sarlavha, children }: { sarlavha: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-karta-sarlavha">{sarlavha}</h2>
      {children}
    </section>
  );
}

/**
 * F3 — onboarding javoblarini tahrirlash, tekshiruvi onboardingdagi bilan bir xil. Joriy vazn
 * bu yerda yo'q: u tarix yozuvi. Javoblar kunlik normani o'zgartirsa, saqlashdan oldin tasdiq
 * so'raladi — yangi son serverdagi bilan bitta formuladan (`normaHisobi`) hisoblanadi.
 */
export function ShaxsiyMalumot({ profil }: { profil: Profil }) {
  const router = useRouter();
  const { t, erkin } = useTarjima();
  const [forma, setForma] = useState(() => shaxsiyFormaYarat(profil));
  const [varaq, setVaraq] = useState<"afzalliklar" | "odatlar" | "norma" | null>(null);
  const [saqlanmoqda, setSaqlanmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);

  const { vaznBirligi, boyBirligi } = profil.sozlamalar;
  const tekshiruv = shaxsiyniTayyorla(forma, profil);
  const xatoMatni = (maydon: MaydonXatosi | null) =>
    maydon
      ? t(maydon.kalit, ...maydon.qiymatlar.map((q) => (typeof q === "string" ? erkin(q) : q)))
      : undefined;

  const { yangiNorma } = tekshiruv;
  const normaOzgaradi =
    profil.norma !== null && yangiNorma !== null && yangiNorma !== profil.norma;

  const afzalliklarMatni = forma.ovqatAfzalliklari
    .map((qiymat) => AFZALLIKLAR.find((a) => a.qiymat === qiymat))
    .flatMap((variant) => (variant ? [t(variant.nomi)] : []))
    .join(", ");
  const mahal = MAHALLAR.find((m) => m.qiymat === forma.mahal);
  const joy = JOYLAR.find((j) => j.qiymat === forma.joy);
  const odatlarMatni = [mahal && erkin(mahal.nomi), joy && t(joy.nomi)].filter(Boolean).join(" · ");

  async function saqla() {
    if (!tekshiruv.tana) return;
    setXato(null);
    setSaqlanmoqda(true);
    try {
      const javob = await apiSorov("/api/profil", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tekshiruv.tana),
      });
      if (!javob.ok) {
        const tana = (await javob.json().catch(() => null)) as { xato?: string } | null;
        setXato(javob.status === 400 && tana?.xato ? erkin(tana.xato) : t("Saqlanmadi. Qayta urinib ko'ring"));
        setSaqlanmoqda(false);
        setVaraq(null);
        return;
      }
      router.push("/profil");
      router.refresh();
    } catch {
      setXato(t("Saqlanmadi. Qayta urinib ko'ring"));
      setSaqlanmoqda(false);
      setVaraq(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-12">
      <OrqagaSarlavha sarlavha={t("Shaxsiy ma'lumot")} orqagaNomi={t("Orqaga")} href="/profil" />

      <div className="flex flex-col gap-6">
        <OnboardingMaydoni
          nomi={t("Ism")}
          turi="matn"
          qiymat={forma.ism}
          xato={tekshiruv.ismUzun ? t("{0} belgidan oshmasin", ISM_CHEGARASI) : undefined}
          onChange={(ism) => setForma({ ...forma, ism })}
        />

        <div className="flex flex-col gap-2">
          <span className="text-izoh text-matn-2">{t("Jins")}</span>
          <SegmentTanlagich
            nomi={t("Jins")}
            variantlar={JINS_VARIANTLARI}
            tanlangan={forma.jins}
            onTanla={(jins) => setForma({ ...forma, jins })}
          />
        </div>

        {/* 18 dan kichik yosh saqlashni to'smaydi, faqat qizil izoh — O5 bilan bir xil (DECISIONS 2026-09-22). */}
        <OnboardingMaydoni
          nomi={t("Yosh")}
          birlik={t("yosh")}
          turi="butun"
          qiymat={forma.yosh}
          xato={
            xatoMatni(tekshiruv.yosh) ??
            (Number(forma.yosh) > 0 && Number(forma.yosh) < YOSH_OGOHLANTIRISH_YOSHI
              ? t(YOSH_XATOSI)
              : undefined)
          }
          onChange={(yosh) => setForma({ ...forma, yosh })}
        />

        <OnboardingMaydoni
          nomi={t("Bo'y")}
          birlik={erkin(boyBirligi)}
          qiymat={forma.boyi}
          xato={xatoMatni(tekshiruv.boyi)}
          onChange={(boyi) => setForma({ ...forma, boyi })}
        />

        <Bolim sarlavha={t("Maqsad")}>
          <Variantlar
            nomi={t("Maqsad")}
            variantlar={nomlari(MAQSADLAR)}
            tanlangan={forma.maqsad ? [forma.maqsad] : []}
            onTanla={(maqsad) => setForma({ ...forma, maqsad })}
          />
        </Bolim>

        {/* Prototipdagidek doim ko'rinadi; "Vaznni saqlash"da qiymat tekshirilmaydi va saqlanmaydi. */}
        <OnboardingMaydoni
          nomi={t("Maqsad vazn")}
          birlik={erkin(vaznBirligi)}
          qiymat={forma.maqsadVazn}
          xato={xatoMatni(tekshiruv.maqsadVazn)}
          onChange={(maqsadVazn) => setForma({ ...forma, maqsadVazn })}
        />

        <Bolim sarlavha={t("Faollik darajasi")}>
          <Variantlar
            nomi={t("Faollik darajasi")}
            variantlar={nomlari(FAOLLIKLAR)}
            tanlangan={forma.faollik ? [forma.faollik] : []}
            onTanla={(faollik) => setForma({ ...forma, faollik })}
          />
        </Bolim>

        <Bolim sarlavha={t("Ovqat afzalliklari va odatlari")}>
          <div className="overflow-hidden rounded-karta border border-karta-chegara bg-karta">
            <SozlamaQatori
              nomi={t("Afzalliklar")}
              qiymat={afzalliklarMatni || t("Tanlanmagan")}
              onClick={() => setVaraq("afzalliklar")}
            />
            <SozlamaQatori
              nomi={t("Odatlar")}
              qiymat={odatlarMatni || t("Tanlanmagan")}
              onClick={() => setVaraq("odatlar")}
            />
          </div>
          <p className="text-izoh text-matn-2">
            {t("Bu javoblar hozircha taom takliflari uchun saqlanadi.")}
          </p>
        </Bolim>

        {/* Prototip F3: izoh va Statistika bo'limida P2 panelini ochadigan tugma bitta kartada. */}
        <div className="flex flex-col gap-2 rounded-karta border border-karta-chegara bg-karta p-4">
          <p className="text-izoh text-matn-2">
            {t("Joriy vazn bu yerda o'zgartirilmaydi — u tarix yozuvi.")}
          </p>
          <Tugma korinish="uchinchi" onClick={() => router.push("/progress?vazn=1")}>
            {t("Progress bo'limida vazn qo'shish")}
          </Tugma>
        </div>

        <div className="flex flex-col gap-2">
          {xato && (
            <p role="alert" className="text-izoh text-xato">
              {xato}
            </p>
          )}
          <Tugma
            disabled={!tekshiruv.tana}
            yuklanmoqda={saqlanmoqda}
            onClick={() => (normaOzgaradi ? setVaraq("norma") : void saqla())}
          >
            {t("Saqlash")}
          </Tugma>
        </div>
      </div>

      {varaq === "afzalliklar" && (
        <PastkiVaraq sarlavha={t("Afzalliklar")} onYop={() => setVaraq(null)}>
          <div className="flex flex-col gap-4">
            <Variantlar
              nomi={t("Afzalliklar")}
              variantlar={AFZALLIKLAR}
              tanlangan={forma.ovqatAfzalliklari}
              kop
              onTanla={(qiymat) =>
                setForma({
                  ...forma,
                  ovqatAfzalliklari: afzallikBosildi(forma.ovqatAfzalliklari, qiymat),
                })
              }
            />
            <Tugma onClick={() => setVaraq(null)}>{t("Tayyor")}</Tugma>
          </div>
        </PastkiVaraq>
      )}

      {varaq === "norma" && profil.norma !== null && yangiNorma !== null && (
        <PastkiVaraq sarlavha={t("Norma o'zgaradi")} onYop={() => setVaraq(null)}>
          <div className="flex flex-col gap-4">
            <p className="text-asosiy tabular-nums">
              {t(
                "Kunlik normangiz {0} dan {1} ga o'zgaradi. Saqlansinmi?",
                raqam(profil.norma),
                raqam(yangiNorma),
              )}
            </p>
            <p className="text-izoh text-matn-2">
              {t("O'tgan kunlar qayta hisoblanmaydi — har kun o'sha kundagi norma bilan qoladi.")}
            </p>
            <div className="flex flex-col gap-2">
              <Tugma yuklanmoqda={saqlanmoqda} onClick={() => void saqla()}>
                {t("Saqlash")}
              </Tugma>
              <Tugma korinish="uchinchi" disabled={saqlanmoqda} onClick={() => setVaraq(null)}>
                {t("Bekor qilish")}
              </Tugma>
            </div>
          </div>
        </PastkiVaraq>
      )}

      {varaq === "odatlar" && (
        <PastkiVaraq sarlavha={t("Odatlar")} onYop={() => setVaraq(null)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-izoh text-matn-2">{t("Kuniga necha mahal")}</span>
              <SegmentTanlagich
                nomi={t("Kuniga necha mahal")}
                variantlar={MAHALLAR}
                tanlangan={forma.mahal}
                onTanla={(qiymat) => setForma({ ...forma, mahal: qiymat })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-izoh text-matn-2">{t("Asosan qayerda")}</span>
              <SegmentTanlagich
                nomi={t("Asosan qayerda")}
                variantlar={JOYLAR}
                tanlangan={forma.joy}
                onTanla={(qiymat) => setForma({ ...forma, joy: qiymat })}
              />
            </div>
            <Tugma onClick={() => setVaraq(null)}>{t("Tayyor")}</Tugma>
          </div>
        </PastkiVaraq>
      )}
    </main>
  );
}
