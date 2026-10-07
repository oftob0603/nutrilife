"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState, useSyncExternalStore, useTransition } from "react";
import { Variantlar } from "@/app/_components/onboarding/Variantlar";
import { PastkiVaraq } from "@/app/_components/PastkiVaraq";
import { useTarjima, useTilniOrnat } from "@/app/_components/TilTaminoti";
import { TugmaHavola } from "@/app/_components/Tugma";
import { useOnlayn } from "@/app/_components/useOnlayn";
import { telegramHavolaniOch } from "@/lib/telegram";
import type { Kalit } from "@/lib/lugat/tarjima";
import { MAVZU_NOMLARI, mavzuniTanla, tizimgaObuna, tizimQorongimi } from "@/lib/mavzu";
import { apiSorov } from "@/lib/services/api-klient";
import {
  SOZLAMA_VARIANTLARI,
  TIL_NOMLARI,
  type SozlamaKaliti,
  type Sozlamalar as SozlamalarTuri,
} from "@/lib/services/sozlamalar-hisob";
import { SozlamaQatori } from "./SozlamaQatori";

const QATORLAR: readonly { kalit: SozlamaKaliti; nomi: Kalit }[] = [
  { kalit: "til", nomi: "Til" },
  { kalit: "mavzu", nomi: "Mavzu" },
  { kalit: "vaznBirligi", nomi: "Vazn birligi" },
  { kalit: "boyBirligi", nomi: "Bo'y birligi" },
];

const HUJJAT_HAVOLALARI: readonly { href: string; nomi: Kalit }[] = [
  { href: "/shartlar", nomi: "Foydalanish shartlari" },
  { href: "/maxfiylik", nomi: "Maxfiylik siyosati" },
  { href: "/oferta", nomi: "Ommaviy oferta" },
];

/** Variantning ekrandagi nomi: til o'z tilida, mavzu va birliklar lug'at orqali. */
function variantNomi(kalit: SozlamaKaliti, qiymat: string): string {
  if (kalit === "til") return TIL_NOMLARI[qiymat as SozlamalarTuri["til"]];
  if (kalit === "mavzu") return MAVZU_NOMLARI[qiymat as SozlamalarTuri["mavzu"]];
  return qiymat;
}

/**
 * Sozlama qatorlari — alohida sahifa emas, Profil sahifasining o'zida (prototip): qator
 * bosilganda variantlar pastki panelda ochiladi, tanlov darhol saqlanadi. Har qator o'zi
 * saqlanadi va o'z xatosini ko'rsatadi; internet yo'q bo'lsa qatorlar faqat o'qish uchun.
 */
export function Sozlamalar({
  boshlangich,
  admin,
}: {
  boshlangich: SozlamalarTuri;
  /** Admin Telegram username'i — "Yordam" qatori shu chatni ochadi; null bo'lsa qator yo'q. */
  admin: string | null;
}) {
  const router = useRouter();
  const { t, erkin } = useTarjima();
  const tilniOrnat = useTilniOrnat();
  const [sozlamalar, setSozlamalar] = useState(boshlangich);
  const [ochiq, setOchiq] = useState<SozlamaKaliti | null>(null);
  const [saqlanmoqda, setSaqlanmoqda] = useState<SozlamaKaliti | null>(null);
  const [xato, setXato] = useState<SozlamaKaliti | null>(null);
  const [, yangila] = useTransition();

  const tizimQorongi = useSyncExternalStore(
    tizimgaObuna,
    tizimQorongimi,
    () => false,
  );
  const onlayn = useOnlayn();

  function qiymatMatni(kalit: SozlamaKaliti): string {
    const nomi = erkin(variantNomi(kalit, sozlamalar[kalit]));
    // "Tizim" nimaga aylanganini ham ko'rsatadi: "Tizim · qorong'i".
    if (kalit === "mavzu" && sozlamalar.mavzu === "tizim") {
      return `${nomi} · ${t(tizimQorongi ? "Qorong'i" : "Yorug'").toLowerCase()}`;
    }
    return nomi;
  }

  async function tanla(kalit: SozlamaKaliti, qiymat: string) {
    setOchiq(null);
    if (qiymat === sozlamalar[kalit]) return;

    setXato(null);
    setSaqlanmoqda(kalit);
    try {
      const javob = await apiSorov("/api/profil/sozlamalar", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ [kalit]: qiymat }),
      });
      if (!javob.ok) throw new Error();

      const yangi = { ...sozlamalar, [kalit]: qiymat } as SozlamalarTuri;
      if (kalit === "mavzu") {
        mavzuniTanla(yangi.mavzu);
        setSozlamalar(yangi);
        setSaqlanmoqda(null);
        return;
      }
      // Til va birlik serverda chizilgan matnlarga ham tegadi ("Qisqacha" dagi vaznlar, butun
      // sahifa tili; javob til cookie'sini yangilagan). Hammasi bitta o'tishda: klient matnlari
      // server javobi bilan birga almashadi — sahifa bir lahza ham ikki tilda turmaydi. Qatorda
      // shu paytgacha "saqlanmoqda…" turadi.
      yangila(() => {
        setSozlamalar(yangi);
        if (kalit === "til") tilniOrnat(yangi.til);
        router.refresh();
        setSaqlanmoqda(null);
      });
    } catch {
      // Tanlov qo'llanmagan — qatorda eski qiymat turibdi.
      setXato(kalit);
      setSaqlanmoqda(null);
    }
  }

  return (
    <>
      <section className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-karta border border-karta-chegara bg-karta">
          {QATORLAR.map(({ kalit, nomi }) => (
            <SozlamaQatori
              key={kalit}
              nomi={t(nomi)}
              qiymat={qiymatMatni(kalit)}
              holat={saqlanmoqda === kalit ? "saqlanmoqda" : xato === kalit ? "xato" : undefined}
              ochiq={onlayn && saqlanmoqda !== kalit}
              onClick={() => setOchiq(kalit)}
            />
          ))}
          <SozlamaQatori nomi={t("Shaxsiy ma'lumot")} href="/profil/shaxsiy" />
        </div>

        {!onlayn && (
          <p role="status" className="text-izoh text-matn-2">
            {t("Internet yo'q. Sozlamalar o'qish uchun ochiq, o'zgartirish vaqtincha bloklangan.")}
          </p>
        )}
      </section>

      {/* Prototip F1 "Yordam" — alohida F6 ekrani o'rniga admin bilan Telegram chati (DECISIONS 2026-09-23). */}
      {admin && (
        <div className="overflow-hidden rounded-karta border border-karta-chegara bg-karta">
          <SozlamaQatori
            nomi={t("Yordam")}
            onClick={() => telegramHavolaniOch(`https://t.me/${admin}`)}
          />
        </div>
      )}

      {/*
       * Huquqiy hujjatlar — karta qatori emas, mayda havolalar
       * (foydalanuvchi qarori 2026-09-23). Chiziq doimiy — bosilmasdan ham havola ekani ko'rinib turadi.
       */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-izoh text-matn-2">
        {HUJJAT_HAVOLALARI.map(({ href, nomi }, i) => (
          <Fragment key={href}>
            {i > 0 && <span className="text-matn-3">·</span>}
            <Link
              href={href}
              className="underline decoration-chegara underline-offset-2 active:decoration-matn-2"
            >
              {t(nomi)}
            </Link>
          </Fragment>
        ))}
      </div>

      <TugmaHavola korinish="uchinchiXavfli" href="/profil/ochirish">
        {t("Hisobni o'chirish")}
      </TugmaHavola>

      {ochiq && (
        <PastkiVaraq sarlavha={t(QATORLAR.find((q) => q.kalit === ochiq)!.nomi)} onYop={() => setOchiq(null)}>
          <Variantlar
            nomi={t(QATORLAR.find((q) => q.kalit === ochiq)!.nomi)}
            variantlar={SOZLAMA_VARIANTLARI[ochiq].map((qiymat) => ({
              qiymat,
              nomi: variantNomi(ochiq, qiymat),
            }))}
            tanlangan={[sozlamalar[ochiq]]}
            onTanla={(qiymat) => void tanla(ochiq, qiymat)}
          />
        </PastkiVaraq>
      )}
    </>
  );
}
