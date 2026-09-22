"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PastkiVaraq } from "@/app/_components/PastkiVaraq";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { Maydon } from "@/app/_components/YozuvFormasi";
import { apiSorov } from "@/lib/services/api-klient";
import { kgdanLb, lbdanKg, VAZN } from "@/lib/services/onboarding-hisob";
import { vaznMatni } from "@/lib/services/profil-hisob";
import {
  SAKRASH_CHEGARASI,
  sonMatni,
  vaznQiymati,
  type NormaOzgarishi,
  type Progress,
} from "@/lib/services/progress-hisob";
import { raqam } from "@/lib/services/taom-hisob";
import { sonOqi } from "@/lib/services/yozuv-forma";
import { kunOyMatni } from "@/lib/services/yozuv-hisob";
import { VAZN_PANELINI_OCH, type VaznPaneliTafsiloti } from "./vazn-hodisa";

const XABAR_MS = 5000;

/**
 * P2 — vazn kiritish paneli (progress-tz.md). Kuniga bitta yozuv: bugungisi bor bo'lsa
 * yangilanadi, sarlavha shuni aytadi. O'tgan kunga vazn qo'shilmaydi — sana faqat bugun.
 * Oldingi o'lchovdan 5 kg dan ko'p farq — tasdiq so'raladi, to'silmaydi (terish xatosini
 * ushlaydi). Saqlangach norma qayta hisoblanadi; o'zgargan bo'lsa panel yopilgach bir
 * qatorli xabar chiqadi. P3 dan tahrirlash uchun ham shu panel ochiladi (`vaznPaneliniOch`).
 */
export function VaznPaneli({ progress }: { progress: Progress }) {
  const router = useRouter();
  const t = useTarjima();
  const { til } = t;
  const { vaznBirligi: birlik, bugun, vaznlar } = progress;
  const [ochiq, setOchiq] = useState<{ tafsilot: VaznPaneliTafsiloti } | null>(null);
  const [matn, setMatn] = useState("");
  const [tasdiq, setTasdiq] = useState(false);
  const [saqlanmoqda, setSaqlanmoqda] = useState(false);
  const [xato, setXato] = useState(false);
  const [xabar, setXabar] = useState<NormaOzgarishi | null>(null);

  const oxirgi = vaznlar[vaznlar.length - 1];
  const bugunBor = oxirgi.sana === bugun;

  useEffect(() => {
    const och = (hodisa: Event) => {
      const tafsilot = (hodisa as CustomEvent<VaznPaneliTafsiloti>).detail;
      setMatn(sonMatni(vaznQiymati(tafsilot?.vazn ?? oxirgi.vazn, birlik), til));
      setTasdiq(false);
      setXato(false);
      setOchiq({ tafsilot });
    };
    window.addEventListener(VAZN_PANELINI_OCH, och);
    return () => window.removeEventListener(VAZN_PANELINI_OCH, och);
  }, [oxirgi.vazn, birlik, til]);

  useEffect(() => {
    if (!xabar) return;
    const taymer = setTimeout(() => setXabar(null), XABAR_MS);
    return () => clearTimeout(taymer);
  }, [xabar]);

  if (!ochiq) return <Xabar xabar={xabar} />;

  const tahrir = ochiq.tafsilot;
  const birlikNomi = birlik === "lb" ? "lb" : t.t("kg");
  const chegara = birlik === "lb" ? { min: kgdanLb(VAZN.min), max: kgdanLb(VAZN.max) } : VAZN;
  const son = sonOqi(matn);
  const yaroqsiz = son === null || son < chegara.min || son > chegara.max;
  const kg = son === null ? null : birlik === "lb" ? lbdanKg(son) : Math.round(son * 10) / 10;
  // Sakrash tahrirlanayotgan o'lchovning o'ziga emas, undan oldingisiga nisbatan tekshiriladi.
  const solishtirish = vaznlar.filter((nuqta) => nuqta.id !== tahrir?.id).at(-1) ?? null;
  const sakrash =
    kg !== null && solishtirish !== null && Math.abs(kg - solishtirish.vazn) > SAKRASH_CHEGARASI;

  function yop() {
    if (saqlanmoqda) return;
    setOchiq(null);
  }

  async function saqla() {
    if (kg === null || yaroqsiz) return;
    if (sakrash && !tasdiq) {
      setTasdiq(true);
      return;
    }
    setSaqlanmoqda(true);
    setXato(false);
    try {
      const javob = await apiSorov(tahrir ? `/api/vazn/${tahrir.id}` : "/api/vazn", {
        method: tahrir ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ vazn: kg }),
      });
      if (!javob.ok) throw new Error("Saqlanmadi");
      const { norma } = (await javob.json()) as { norma: NormaOzgarishi };
      setOchiq(null);
      if (norma.eski !== null && norma.yangi !== null && norma.eski !== norma.yangi) setXabar(norma);
      router.refresh();
    } catch {
      setXato(true);
    } finally {
      setSaqlanmoqda(false);
    }
  }

  const sarlavha = tahrir
    ? t.t("O'lchovni tahrirlash")
    : bugunBor
      ? t.t("Bugungi vaznni yangilash")
      : t.t("Vazn qo'shish");

  return (
    <PastkiVaraq sarlavha={sarlavha} onYop={yop}>
      <div className="flex flex-col gap-3">
        <Maydon
          nomi={t.t("Vazn")}
          birlik={birlikNomi}
          qiymat={matn}
          bloklangan={saqlanmoqda}
          xato={
            matn.trim() && yaroqsiz
              ? t.t("Vazn {0}–{1} {2} oralig'ida bo'lsin", chegara.min, chegara.max, birlikNomi)
              : undefined
          }
          onChange={(yangi) => {
            setMatn(yangi);
            setTasdiq(false);
          }}
        />
        {sakrash && !tasdiq && solishtirish && (
          <p className="text-izoh text-siyoh">
            {t.t(
              "Oldingi o'lchovdan {0} farq qilyapti. To'g'rimi?",
              vaznMatni(Math.abs(kg - solishtirish.vazn), birlik, t),
            )}
          </p>
        )}
        <div className="flex min-h-11 items-center gap-3 rounded-karta border border-chegara px-4 py-3">
          <span className="min-w-0 flex-1 text-asosiy">{t.t("Sana")}</span>
          <span className="text-izoh text-matn-2 tabular-nums">
            {tahrir ? kunOyMatni(tahrir.sana, til) : t.t("{0} — bugun", kunOyMatni(bugun, til))}
          </span>
        </div>
        {xato && (
          <p role="alert" className="text-center text-asosiy text-xato">
            {t.t("Saqlanmadi. Qayta urinish")}
          </p>
        )}
        <Tugma disabled={yaroqsiz} yuklanmoqda={saqlanmoqda} onClick={saqla}>
          {sakrash && !tasdiq ? t.t("Ha, to'g'ri") : t.t("Saqlash")}
        </Tugma>
      </div>
    </PastkiVaraq>
  );
}

/** Panel yopilgach bir qatorli xabar: "Kunlik normangiz yangilandi: 2,044 → 2,010". */
function Xabar({ xabar }: { xabar: NormaOzgarishi | null }) {
  const { t } = useTarjima();
  if (!xabar || xabar.eski === null || xabar.yangi === null) return null;
  return (
    <p
      role="status"
      className="fixed inset-x-4 bottom-28 z-10 mx-auto max-w-sm rounded-full bg-siyoh px-4 py-2 text-center text-izoh text-fon tabular-nums shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    >
      {t("Kunlik normangiz yangilandi: {0} → {1}", raqam(xabar.eski), raqam(xabar.yangi))}
    </p>
  );
}
