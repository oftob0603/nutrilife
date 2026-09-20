"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiBelgisi } from "@/app/_components/AiBelgisi";
import { Tugma } from "@/app/_components/Tugma";
import { skanJami, type SkanJavobi, type SkanNatija } from "@/lib/services/skan-hisob";

type Javob = SkanJavobi | { holat: "xato"; xabar: string; qaytaUrinsa: boolean };

const QADAMLAR = ["Taom aniqlanmoqda", "Porsiya baholanmoqda", "Kaloriya hisoblanmoqda"];
const QADAM_MS = 1500;
const UZOQ_KUTISH_MS = 10_000;

// Bir xil tahlil ikki marta yuborilmasin: dev rejimda React effektni ikki marta ishga
// tushiradi, har so'rov esa AI xarajati va kunlik hisobdan bitta skan.
const sorovlar = new Map<string, Promise<Javob>>();

async function yubor(tana: { rasmId?: string; matn?: string }): Promise<Javob> {
  try {
    const sorov = await fetch("/api/skan", {
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
      xabar: "AI javob bermadi. Qayta urinib ko'ring yoki taomni qo'lda qo'shing.",
      qaytaUrinsa: true,
    };
  } catch {
    return { holat: "xato", xabar: "Internet bilan aloqa yo'q", qaytaUrinsa: true };
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
  const olcham = kichik ? "max-w-[120px]" : "max-w-[260px]";
  return (
    <div
      className={`relative aspect-square w-full ${olcham} overflow-hidden rounded-karta bg-chegara`}
    >
      {rasmId ? (
        <Image
          src={`/api/rasmlar/${rasmId}`}
          alt="Yuklangan ovqat rasmi"
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
      <h1 className="text-center text-sarlavha">Ovqatingiz tahlil qilinmoqda…</h1>
      <div role="status" className="flex flex-col items-center gap-1">
        <p className="text-asosiy text-matn-2">{QADAMLAR[qadam]}</p>
        {uzoq && <p className="text-izoh text-matn-2">Biroz cho&apos;zilmoqda, kutamiz…</p>}
      </div>
    </div>
  );
}

function Natija({ natija, rasmId }: { natija: SkanNatija; rasmId?: string }) {
  const jami = skanJami(natija);
  const makrolar = [
    { nom: "Oqsil", qiymat: jami.oqsil },
    { nom: "Yog'", qiymat: jami.yog },
    { nom: "Uglevod", qiymat: jami.uglevod },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 pt-6">
      {rasmId && <Manba rasmId={rasmId} kichik />}
      <div className="flex flex-col gap-4 rounded-karta border border-chegara bg-karta p-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="min-w-0 text-sarlavha">{natija.taomNomi}</h1>
          <AiBelgisi />
        </div>
        <div>
          <p className="font-display text-raqam">
            {jami.kaloriya} <span className="font-sans text-asosiy font-normal tracking-normal text-matn-2">kkal</span>
          </p>
          <p className="text-izoh text-matn-2">
            {natija.porsiyaGramm} g porsiya
            {natija.vaznFoydalanuvchidan ? "" : " · taxminiy"}
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2">
          {makrolar.map(({ nom, qiymat }) => (
            <div key={nom} className="rounded-chip bg-fon p-3">
              <dt className="text-izoh text-matn-2">{nom}</dt>
              <dd className="text-karta-sarlavha">{qiymat} g</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-izoh text-matn-2">
        Raqamlar taxminiy — AI rasm yoki tasvirga qarab baholadi. Haqiqiy qiymat porsiya
        va tayyorlanishiga qarab farq qilishi mumkin.
      </p>
    </div>
  );
}

function Xabar({ sarlavha, izoh }: { sarlavha: string; izoh: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-sarlavha">{sarlavha}</h1>
      <p role="alert" className="max-w-xs text-asosiy text-matn-2">
        {izoh}
      </p>
    </div>
  );
}

/**
 * E6 — AI tahlil va uning natijasi. Natija faqat shu komponent holatida turadi: sahifadan
 * chiqilsa hech narsa saqlanmaydi, yozuv esa tasdiqdan keyingina yaratiladi (dizayn-tz).
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
  const [urinish, setUrinish] = useState(0);
  const [kelgan, setKelgan] = useState<{ urinish: number; javob: Javob } | null>(null);

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
  const qolda = (
    <Tugma korinish="ikkilamchi" onClick={() => ket("/taomlar")}>
      Qo&apos;lda qo&apos;shish
    </Tugma>
  );

  let mazmun: React.ReactNode;
  let tugmalar: React.ReactNode;

  if (!javob) {
    mazmun = <Kutish key={urinish} rasmId={rasmId} matn={matn} />;
    tugmalar = (
      <Tugma korinish="uchinchi" onClick={bekorQil}>
        Bekor qilish
      </Tugma>
    );
  } else if (javob.holat === "tayyor") {
    mazmun = <Natija natija={javob.natija} rasmId={rasmId} />;
    tugmalar = (
      <>
        {qolda}
        <Tugma korinish="uchinchi" onClick={bekorQil}>
          Bekor qilish
        </Tugma>
      </>
    );
  } else if (javob.holat === "tanib_bolmadi") {
    mazmun = (
      <Xabar
        sarlavha="Taomni aniq taniy olmadik"
        izoh={
          rasmId
            ? "Rasmda bir nechta taom bor yoki yorug'lik yetmagan bo'lishi mumkin. Qiymatni o'zimiz uydirmaymiz."
            : "Tasvir yetarli emas yoki bu ovqat emas. Qiymatni o'zimiz uydirmaymiz."
        }
      />
    );
    tugmalar = (
      <>
        {rasmId ? (
          <Tugma onClick={() => ket("/kamera")}>Boshqa rasm olish</Tugma>
        ) : (
          <Tugma onClick={bekorQil}>Qayta yozish</Tugma>
        )}
        {qolda}
      </>
    );
  } else {
    mazmun = <Xabar sarlavha="Tahlil qilib bo'lmadi" izoh={javob.xabar} />;
    tugmalar = (
      <>
        {javob.qaytaUrinsa && (
          <Tugma onClick={() => setUrinish((u) => u + 1)}>Qayta urinish</Tugma>
        )}
        {qolda}
        <Tugma korinish="uchinchi" onClick={bekorQil}>
          Bekor qilish
        </Tugma>
      </>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4">
      {mazmun}
      <div className="flex flex-col gap-2 pb-8 pt-6">{tugmalar}</div>
    </main>
  );
}
