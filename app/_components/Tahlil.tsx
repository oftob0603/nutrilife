"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiBelgisi } from "@/app/_components/AiBelgisi";
import { OrqagaSarlavha } from "@/app/_components/profil/OrqagaSarlavha";
import { ProQulfi } from "@/app/_components/ProQulfi";
import { TavsiyaKartasi } from "@/app/_components/TavsiyaKartasi";
import { useTavsiyaAsosi } from "@/app/_components/useTavsiyaAsosi";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { XatoKartasi } from "@/app/_components/XatoKartasi";
import { YozuvFormasi } from "@/app/_components/YozuvFormasi";
import { k } from "@/lib/lugat/tarjima";
import { apiSorov } from "@/lib/services/api-klient";
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

function Manba({ rasmId, matn, kichik = false }: { rasmId?: string; matn?: string; kichik?: boolean }) {
  const { t } = useTarjima();
  const olcham = kichik ? "max-w-[120px]" : "max-w-[260px]";
  return (
    <div
      className={`relative aspect-square w-full ${olcham} overflow-hidden rounded-karta bg-chegara`}
    >
      {rasmId ? (
        <Image
          src={`/api/rasmlar/${rasmId}`}
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
function Kutish({ rasmId, matn }: { rasmId?: string; matn?: string }) {
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
        <Manba rasmId={rasmId} matn={matn} />
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

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pb-8 pt-6">
      <h1 className="text-sarlavha">
        {natija ? t("Natija") : t("Ma'lumotni o'zingiz kiriting")}
      </h1>

      <div className="flex items-center gap-4">
        {rasmId && <Manba rasmId={rasmId} kichik />}
        {natija && (
          <div className="flex min-w-0 flex-col items-start gap-2">
            <AiBelgisi />
            <p className="text-izoh text-matn-2">{t("Raqamlar taxminiy, tahrirlash mumkin")}</p>
          </div>
        )}
      </div>

      <YozuvFormasi
        forma={forma}
        xatolar={korinadiganXatolar}
        birlik="g"
        bloklangan={saqlanmoqda}
        onChange={setForma}
      />

      {natija && tavsiyaAsosi?.yopiq && (
        <ProQulfi zich sarlavha={t("Aqlli porsiya tavsiyalari — PRO")} />
      )}
      {tavsiyaGramm !== null && (
        <TavsiyaKartasi
          sarlavha={t("Tavsiya: {0} g", tavsiyaGramm)}
          izoh={t("Qolgan {0} kkal ichida qoladi", raqam(tavsiyaAsosi?.qoldi ?? 0))}
          onClick={() => {
            if (!saqlanmoqda) setForma(miqdorOzgardi(forma, String(tavsiyaGramm)));
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
    </main>
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
  if (javob?.holat === "tanib_bolmadi" && qoldaKiritish) {
    return <Tasdiq natija={null} rasmId={rasmId} onBekor={bekorQil} />;
  }

  if (!javob) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4">
        <Kutish key={urinish} rasmId={rasmId} matn={matn} />
        <div className="flex flex-col gap-2 pb-8 pt-6">
          <Tugma korinish="uchinchi" onClick={bekorQil}>
            {t("Bekor qilish")}
          </Tugma>
        </div>
      </main>
    );
  }

  // Karta ichida birinchi yo'l "ikkilamchi", qolgani "uchinchi" (prototip `ErrorState`).
  const qolda = (korinish: "ikkilamchi" | "uchinchi") => (
    <Tugma korinish={korinish} onClick={() => ket("/taomlar")}>
      {t("Qo'lda qo'shish")}
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
            {qolda("uchinchi")}
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
          {qolda(javob.qaytaUrinsa ? "uchinchi" : "ikkilamchi")}
        </XatoKartasi>
      )}
    </main>
  );
}
