"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiBelgisi } from "@/app/_components/AiBelgisi";
import { OrqagaSarlavha } from "@/app/_components/profil/OrqagaSarlavha";
import { ProQulfi } from "@/app/_components/ProQulfi";
import { SanashRaqami } from "@/app/_components/SanashRaqami";
import { TavsiyaKartasi } from "@/app/_components/TavsiyaKartasi";
import { useTavsiyaAsosi } from "@/app/_components/useTavsiyaAsosi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { XatoKartasi } from "@/app/_components/XatoKartasi";
import { YozuvFormasi } from "@/app/_components/YozuvFormasi";
import { k } from "@/lib/lugat/tarjima";
import { apiSorov } from "@/lib/services/api-klient";
import { rasmManzili } from "@/lib/services/rasm-yuklash";
import { skanJami, type SkanJavobi, type SkanNatija } from "@/lib/services/skan-hisob";
import { sigadiganGramm } from "@/lib/services/taklif-hisob";
import { raqam } from "@/lib/services/taom-hisob";
import {
  boshForma,
  formaQiymatlari,
  formaTuz,
  formaXatolari,
  miqdorOzgardi,
  sonOqi,
  type Forma,
  type FormaXatolari,
} from "@/lib/services/yozuv-forma";

/** `xabar` — lug'at kaliti yoki server matni; ekranda `erkin()` bilan tarjima qilinadi. */
type Javob = SkanJavobi | { holat: "xato"; xabar: string; qaytaUrinsa: boolean };

const QADAMLAR = [
  k("Taom aniqlanmoqda"),
  k("Porsiya baholanmoqda"),
  k("Kaloriya hisoblanmoqda"),
];
const QADAM_MS = 1500;
const UZOQ_KUTISH_MS = 10_000;

// Bir xil tahlil ikki marta yuborilmasin: dev rejimda React effektni ikki marta ishga
// tushiradi, har so'rov esa AI xarajati va kunlik hisobdan bitta skan.
const sorovlar = new Map<string, Promise<Javob>>();

async function yubor(tana: { rasmId?: string; matn?: string }): Promise<Javob> {
  // Oflaynda so'rov baribir yetmaydi — brauzer kutishini kutmasdan darhol aytamiz.
  if (!navigator.onLine) {
    return { holat: "xato", xabar: k("Internet bilan aloqa yo'q"), qaytaUrinsa: true };
  }
  try {
    const sorov = await apiSorov("/api/skan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(tana),
    });
    const javob = (await sorov.json()) as SkanJavobi | { xato?: string };
    if (sorov.ok && "holat" in javob) return javob;
    // Limit tugagan bo'lsa qayta urinish foyda bermaydi — serverning o'z xabari ko'rsatiladi.
    if (sorov.status === 429 && "xato" in javob && javob.xato) {
      return { holat: "xato", xabar: javob.xato, qaytaUrinsa: false };
    }
    return {
      holat: "xato",
      xabar: k("AI javob bermadi. Qayta urinib ko'ring yoki taomni qo'lda qo'shing."),
      qaytaUrinsa: true,
    };
  } catch {
    return { holat: "xato", xabar: k("Internet bilan aloqa yo'q"), qaytaUrinsa: true };
  }
}

function skanSorovi(kalit: string, tana: { rasmId?: string; matn?: string }) {
  let sorov = sorovlar.get(kalit);
  if (!sorov) {
    sorov = yubor(tana).finally(() => sorovlar.delete(kalit));
    sorovlar.set(kalit, sorov);
  }
  return sorov;
}

/**
 * E6'da kvadrat (260 px), E7'da butun enida, balandligi 160 px (prototip `FoodImage maxHeight`).
 * `manzil` — rasm manzili: telefondagi nusxa (`rasmManzili`) yoki hali yuklanmagan rasmning o'zi.
 */
function Manba({ manzil, matn, keng = false }: { manzil?: string; matn?: string; keng?: boolean }) {
  const { t } = useTarjima();
  const olcham = keng ? "h-40" : "aspect-square max-w-[260px]";
  return (
    <div className={`relative w-full ${olcham} overflow-hidden rounded-karta bg-chegara`}>
      {manzil ? (
        <Image
          src={manzil}
          alt={t("Yuklangan ovqat rasmi")}
          fill
          unoptimized
          priority
          className="object-cover"
        />
      ) : (
        <p className="flex size-full items-center justify-center p-4 text-center text-asosiy text-matn-2">
          <span className="line-clamp-6">{matn}</span>
        </p>
      )}
    </div>
  );
}

/** Kutish holati: skaner chizig'i, almashinuvchi qadamlar, uzoq kutish qatori. */
function Kutish({ manzil, matn }: { manzil?: string; matn?: string }) {
  const { t } = useTarjima();
  const [qadam, setQadam] = useState(0);
  const [uzoq, setUzoq] = useState(false);

  useEffect(() => {
    const almashish = setInterval(
      () => setQadam((q) => Math.min(QADAMLAR.length - 1, q + 1)),
      QADAM_MS,
    );
    const kutish = setTimeout(() => setUzoq(true), UZOQ_KUTISH_MS);
    return () => {
      clearInterval(almashish);
      clearTimeout(kutish);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      {/* Chiziq rasm chegarasidan chiqmasin — konteyner uni qirqadi. */}
      <div className="relative w-full max-w-[260px] overflow-hidden rounded-karta">
        <Manba manzil={manzil} matn={matn} />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[10%] bg-gradient-to-b from-transparent via-aksent to-transparent opacity-90 motion-safe:animate-[skaner_1400ms_cubic-bezier(0.2,0,0,1)_infinite] motion-reduce:hidden"
        />
      </div>
      <h1 className="text-center text-sarlavha">{t("Ovqatingiz tahlil qilinmoqda…")}</h1>
      <div role="status" className="flex flex-col items-center gap-1">
        <p className="text-asosiy text-matn-2">{t(QADAMLAR[qadam])}</p>
        {uzoq && <p className="text-izoh text-matn-2">{t("Biroz cho'zilmoqda, kutamiz…")}</p>}
      </div>
    </div>
  );
}

/**
 * Galereyadan tanlangan rasm serverga yuklanayotgan payt — E6 bilan bir xil ekran, rasm
 * telefonning o'zidan darhol ko'rinadi. Yuklash tugagach (`tayyor`) tahlil ko'rinishiga
 * o'tadi, tahlil sahifasi ochilganda ham rasm joyidan qimirlamaydi.
 */
export function RasmYuklash({
  manzil,
  tayyor,
  xato,
  onQayta,
  onBekor,
}: {
  manzil: string;
  tayyor: boolean;
  xato: string | null;
  onQayta: () => void;
  onBekor: () => void;
}) {
  const { t } = useTarjima();
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4">
      {tayyor ? (
        <Kutish manzil={manzil} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="relative w-full max-w-[260px]">
            <div className={xato ? "" : "opacity-60"}>
              <Manba manzil={manzil} />
            </div>
            {/* Rasm ustida mavzudan qat'i nazar ko'rinsin — Kamera'dagidek sof oq. */}
            {!xato && (
              <span
                aria-hidden="true"
                className="absolute inset-0 m-auto size-10 animate-spin rounded-full border-4 border-white border-t-transparent drop-shadow"
              />
            )}
          </div>
          <h1 className="text-center text-sarlavha">
            {xato ? t("Yuklanmadi") : t("Rasm yuklanmoqda…")}
          </h1>
          {xato && (
            <p role="alert" className="text-center text-asosiy text-xato">
              {xato}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2 pb-8 pt-6">
        {xato && (
          <Tugma korinish="ikkilamchi" onClick={onQayta}>
            {t("Qayta urinish")}
          </Tugma>
        )}
        <Tugma korinish="uchinchi" onClick={onBekor}>
          {t("Bekor qilish")}
        </Tugma>
      </div>
    </main>
  );
}

/**
 * E7 — tasdiqlash va tahrirlash. `natija` bo'lmasa forma bo'sh ochiladi ("taniy olmadik"
 * dan kelingan): qiymatni foydalanuvchi o'zi kiritadi, shuning uchun AI belgisi yo'q va
 * yozuv manbasi "qolda". Yozuv faqat shu yerdagi tasdiqdan keyin yaratiladi.
 */
function Tasdiq({
  natija,
  rasmId,
  onBekor,
}: {
  natija: SkanNatija | null;
  rasmId?: string;
  onBekor: () => void;
}) {
  const router = useRouter();
  const { t } = useTarjima();
  const [forma, setForma] = useState<Forma>(() =>
    natija
      ? formaTuz({
          taomNomi: natija.taomNomi,
          miqdor: natija.porsiyaGramm,
          ...skanJami(natija),
        })
      : boshForma(),
  );
  const [saqlanmoqda, setSaqlanmoqda] = useState(false);
  const [saqlanmadi, setSaqlanmadi] = useState(false);
  // "~" — AI taxmin qilgan qiymat belgisi (prototip `edited`): foydalanuvchi son yozgan
  // zahoti porsiya va undan chiqadigan hamma narsa aniq hisoblanadi — belgi yo'qoladi.
  const [tahrirlandi, setTahrirlandi] = useState(natija === null);
  const taxminiy = natija !== null && !tahrirlandi;
  const kaloriya = sonOqi(forma.kaloriya) ?? 0;
  // Porsiya tavsiyasi (PRO, prototip `ResultScreen`): AI zichligidan qolgan kaloriyaga
  // sig'adigan gramm; faqat AI natijasida — bo'sh formada zichlik yo'q. Asos yuklanmasa
  // (oflayn, eski API) karta ham, qulf ham chiqmaydi.
  const tavsiyaAsosi = useTavsiyaAsosi();
  const tavsiyaGramm =
    natija && tavsiyaAsosi && !tavsiyaAsosi.yopiq
      ? sigadiganGramm(natija.kaloriya100, sonOqi(forma.miqdor) ?? 0, tavsiyaAsosi.qoldi)
      : null;

  const xatolar = formaXatolari(forma);
  const yaroqsiz = Object.keys(xatolar).length > 0;
  // Bo'sh formada foydalanuvchi hali yozmagan maydon qizarib turmasin.
  const korinadiganXatolar: FormaXatolari = natija
    ? xatolar
    : Object.fromEntries(
        Object.entries(xatolar).filter(
          ([maydon]) => forma[maydon as keyof FormaXatolari].trim() !== "",
        ),
      );

  async function tasdiqla() {
    setSaqlanmoqda(true);
    setSaqlanmadi(false);
    const { miqdor, ...qiymatlar } = formaQiymatlari(forma);
    try {
      const javob = await apiSorov("/api/ovqat-yozuvlari", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...qiymatlar,
          taomId: null,
          porsiya: `${miqdor} g`,
          manba: natija ? "ai" : "qolda",
          rasmId,
        }),
      });
      if (!javob.ok) throw new Error("Saqlanmadi");
      const { yozuv } = (await javob.json()) as { yozuv: { id: string } };
      router.push(`/qoshildi/${yozuv.id}`);
    } catch {
      // Tahrirlar joyida qoladi, ekran yopilmaydi (dizayn-tz E7).
      setSaqlanmadi(true);
      setSaqlanmoqda(false);
    }
  }

  function formaOzgardi(yangi: Forma) {
    // Nom yoki ovqat turi o'zgarishi taxminni aniq qilmaydi — faqat sonlar.
    if (
      yangi.miqdor !== forma.miqdor ||
      yangi.kaloriya !== forma.kaloriya ||
      yangi.oqsil !== forma.oqsil ||
      yangi.yog !== forma.yog ||
      yangi.uglevod !== forma.uglevod
    ) {
      setTahrirlandi(true);
    }
    setForma(yangi);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8">
      {/* Prototip `ScreenHeader onBack` — orqaga bekor qilish bilan bir xil (yozuv hali yo'q). */}
      <OrqagaSarlavha
        sarlavha={natija ? t("Natija") : t("Ma'lumotni o'zingiz kiriting")}
        orqagaNomi={t("Orqaga")}
        onOrqaga={onBekor}
      />

      <div className="flex flex-1 flex-col gap-4">
        {rasmId && <Manba manzil={rasmManzili(rasmId)} keng />}

        {natija && (
          <div className="flex flex-col gap-3">
            {/* E7'ning asosiy lahzasi: kaloriya 0 dan sanab to'ladi, taxmin bo'lsa "~" bilan. */}
            <p className="flex items-baseline gap-2">
              <SanashRaqami
                qiymat={kaloriya}
                boshlangich={0}
                format={(son) => `${taxminiy ? "~" : ""}${raqam(son)}`}
                className="font-display text-raqam"
              />
              <span className="text-karta-sarlavha text-matn-2">{t("kkal")}</span>
            </p>
            <div>
              <AiBelgisi />
            </div>
          </div>
        )}

        <YozuvFormasi
          forma={forma}
          xatolar={korinadiganXatolar}
          birlik="g"
          bloklangan={saqlanmoqda}
          taxminiy={taxminiy}
          porsiyaIzohi={
            taxminiy && (
              <p className="-mt-2 flex items-start gap-2 text-[11px] leading-[1.45] text-matn-2">
                <Uchqun />
                <span className="min-w-0 flex-1">
                  {t(
                    "AI porsiyani taxmin qildi. Og'irlikni aniq kiritsangiz, natija yanada aniq bo'ladi.",
                  )}
                </span>
              </p>
            )
          }
          onChange={formaOzgardi}
        />

      {natija && tavsiyaAsosi?.yopiq && (
        <ProQulfi zich sarlavha={t("Aqlli porsiya tavsiyalari — PRO")} />
      )}
      {tavsiyaGramm !== null && (
        <TavsiyaKartasi
          sarlavha={t("Tavsiya: {0} g", tavsiyaGramm)}
          izoh={t("Qolgan {0} kkal ichida qoladi", raqam(tavsiyaAsosi?.qoldi ?? 0))}
          onClick={() => {
            if (!saqlanmoqda) formaOzgardi(miqdorOzgardi(forma, String(tavsiyaGramm)));
          }}
        />
      )}

        <div className="mt-auto flex flex-col gap-2 pt-2">
          {saqlanmadi && (
            <p role="alert" className="text-center text-asosiy text-xato">
              {t("Yozuv saqlanmadi. Qayta urinib ko'ring")}
            </p>
          )}
          <Tugma
            korinish="aksent"
            yuklanmoqda={saqlanmoqda}
            disabled={yaroqsiz}
            onClick={tasdiqla}
          >
            {saqlanmadi ? t("Qayta urinish") : t("Tasdiqlash va qo'shish")}
          </Tugma>
          <Tugma korinish="uchinchi" disabled={saqlanmoqda} onClick={onBekor}>
            {t("Bekor qilish")}
          </Tugma>
        </div>
      </div>
    </main>
  );
}

/** Lucide `sparkles`, 12 px, aksent matn rangida (prototip E7 izohi). */
function Uchqun() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-[3px] shrink-0 text-aksent-matn"
    >
      <path d="M9.9 2.9 11.4 7a3 3 0 0 0 1.8 1.8l4.1 1.5-4.1 1.5a3 3 0 0 0-1.8 1.8l-1.5 4.1-1.5-4.1a3 3 0 0 0-1.8-1.8L2.5 10.3l4.1-1.5A3 3 0 0 0 8.4 7z" />
      <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
    </svg>
  );
}

/**
 * E6 — AI tahlil, javob kelgach E7 (tasdiqlash). Natija faqat shu komponent holatida turadi:
 * sahifadan chiqilsa hech narsa saqlanmaydi, yozuv esa tasdiqdan keyingina yaratiladi (dizayn-tz).
 * `onBekor` berilsa (matn oqimi) bekor qilish oldingi formaga qaytaradi, aks holda Home'ga.
 */
export function Tahlil({
  rasmId,
  matn,
  onBekor,
}: {
  rasmId?: string;
  matn?: string;
  onBekor?: () => void;
}) {
  const router = useRouter();
  const { t, erkin } = useTarjima();
  const [urinish, setUrinish] = useState(0);
  const [kelgan, setKelgan] = useState<{ urinish: number; javob: Javob } | null>(null);
  const [qoldaKiritish, setQoldaKiritish] = useState(false);

  useEffect(() => {
    let bekor = false;
    void skanSorovi(`${rasmId ?? ""}|${matn ?? ""}|${urinish}`, { rasmId, matn }).then(
      (javob) => {
        if (!bekor) setKelgan({ urinish, javob });
      },
    );
    return () => {
      bekor = true;
    };
  }, [rasmId, matn, urinish]);

  const javob = kelgan?.urinish === urinish ? kelgan.javob : null;

  /** Foydalanuvchi natijadan voz kechdi — yozuvga bog'lanmagan rasm egasiz qolmasin. */
  function ket(manzil: string) {
    if (rasmId) {
      void fetch(`/api/rasmlar/${rasmId}`, { method: "DELETE", keepalive: true }).catch(
        () => {},
      );
    }
    router.push(manzil);
  }

  const bekorQil = onBekor ?? (() => ket("/"));

  if (javob?.holat === "tayyor") {
    return <Tasdiq natija={javob.natija} rasmId={rasmId} onBekor={bekorQil} />;
  }
  // Ikkala xato ekranidan ham ochiladi: AI taniy olmadi yoki javob bermadi — qiymatni
  // foydalanuvchining o'zi kiritadi (bo'sh forma, AI belgisiz, skan sarflanmaydi).
  if (javob && qoldaKiritish) {
    return <Tasdiq natija={null} rasmId={rasmId} onBekor={bekorQil} />;
  }

  if (!javob) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4">
        <Kutish key={urinish} manzil={rasmId && rasmManzili(rasmId)} matn={matn} />
        <div className="flex flex-col gap-2 pb-8 pt-6">
          <Tugma korinish="uchinchi" onClick={bekorQil}>
            {t("Bekor qilish")}
          </Tugma>
        </div>
      </main>
    );
  }

  // Karta ichida birinchi yo'l "ikkilamchi", qolgani "uchinchi" (prototip `ErrorState`).
  // Taom bazasiga yo'l yo'q (DECISIONS 2026-09-22) — zaxira yo'l qiymatni o'zi kiritish.
  const ozimKiritaman = (korinish: "ikkilamchi" | "uchinchi") => (
    <Tugma korinish={korinish} onClick={() => setQoldaKiritish(true)}>
      {t("Baribir tahrirlab kiritish")}
    </Tugma>
  );

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8">
      <OrqagaSarlavha sarlavha={t("Tahlil")} orqagaNomi={t("Orqaga")} onOrqaga={bekorQil} />
      {javob.holat === "tanib_bolmadi" ? (
        <>
          <XatoKartasi
            sarlavha={t("Taomni aniq taniy olmadik")}
            izoh={
              rasmId
                ? t(
                    "Rasmda bir nechta taom bor yoki yorug'lik yetmagan bo'lishi mumkin. Qiymatni o'zimiz uydirmaymiz.",
                  )
                : t("Tasvir yetarli emas yoki bu ovqat emas. Qiymatni o'zimiz uydirmaymiz.")
            }
          >
            {rasmId ? (
              <Tugma korinish="ikkilamchi" onClick={() => ket("/kamera")}>
                {t("Boshqa rasm olish")}
              </Tugma>
            ) : (
              <Tugma korinish="ikkilamchi" onClick={bekorQil}>
                {t("Qayta yozish")}
              </Tugma>
            )}
          </XatoKartasi>
          <div className="mt-3">
            <Tugma korinish="uchinchi" onClick={() => setQoldaKiritish(true)}>
              {t("Baribir tahrirlab kiritish")}
            </Tugma>
          </div>
        </>
      ) : (
        <XatoKartasi sarlavha={t("Tahlil qilib bo'lmadi")} izoh={erkin(javob.xabar)}>
          {javob.qaytaUrinsa && (
            <Tugma korinish="ikkilamchi" onClick={() => setUrinish((u) => u + 1)}>
              {t("Qayta urinish")}
            </Tugma>
          )}
          {ozimKiritaman(javob.qaytaUrinsa ? "uchinchi" : "ikkilamchi")}
        </XatoKartasi>
      )}
    </main>
  );
}
