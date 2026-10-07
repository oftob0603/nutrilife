"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Ikona } from "./Ikona";

const PRO_HAVOLA = "/pro?manba=imkoniyat";

/**
 * Yurak tugmasi (prototip `FavouriteButton`): sevimlida to'ldirilgan xato rangida, aks holda
 * kulrang kontur. Sevimli PRO ostida — FREE'da qulf ko'rinadi va W1 ochiladi. Bosilish darhol
 * ko'rinadi, so'rov orqada ketadi; xato bo'lsa eski holat qaytadi. Karta havolasining ustida
 * turadi, shuning uchun bosish kartaga o'tmaydi.
 */
export function SevimliTugmasi({
  id,
  sevimli: boshlangich,
  yopiq,
  olcham = 32,
}: {
  id: string;
  sevimli: boolean;
  yopiq: boolean;
  olcham?: 32 | 44;
}) {
  const { t } = useTarjima();
  const router = useRouter();
  const [sevimli, setSevimli] = useState(boshlangich);
  const [ketmoqda, setKetmoqda] = useState(false);

  const asos = `relative z-10 inline-flex shrink-0 items-center justify-center rounded-full bg-karta transition-transform active:scale-[0.92] ${
    olcham === 44 ? "size-11" : "size-8"
  }`;

  if (yopiq) {
    return (
      <Link href={PRO_HAVOLA} aria-label={t("Sevimlilarga qo'shish")} className={`${asos} text-matn-3`}>
        <Ikona nomi="lock" olcham={16} />
      </Link>
    );
  }

  async function almashtir() {
    if (ketmoqda) return;
    const yangi = !sevimli;
    setSevimli(yangi);
    setKetmoqda(true);
    try {
      const javob = await fetch(`/api/retseptlar/${id}/sevimli`, { method: yangi ? "POST" : "DELETE" });
      if (!javob.ok) throw new Error(String(javob.status));
      // "Sevimli" chipi va boshqa kartalar serverdan qayta o'qiladi.
      router.refresh();
    } catch {
      setSevimli(!yangi);
    } finally {
      setKetmoqda(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={sevimli ? t("Sevimlilardan olib tashlash") : t("Sevimlilarga qo'shish")}
      aria-pressed={sevimli}
      onClick={almashtir}
      className={`${asos} ${sevimli ? "text-xato" : "text-matn-3"}`}
    >
      <Ikona nomi="heart" olcham={olcham === 44 ? 20 : 16} toldirilgan={sevimli} />
    </button>
  );
}
