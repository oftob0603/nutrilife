"use client";

import { useState } from "react";

/**
 * Telegram profil rasmi; rasm yo'q, yashirilgan yoki yuklanmagan bo'lsa — ismning bosh harfi
 * (prototip F1). Rasm Telegram serveridan to'g'ridan-to'g'ri olinadi, bizda saqlanmaydi.
 */
export function Avatar({ manzil, ism }: { manzil: string | null; ism: string | null }) {
  const [yuklanmadi, setYuklanmadi] = useState(false);
  const harf = ism?.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <span
      aria-hidden="true"
      className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-chegara text-karta-sarlavha text-matn-2"
    >
      {manzil && !yuklanmadi ? (
        // eslint-disable-next-line @next/next/no-img-element -- tashqi, o'lchami kichik rasm; next/image uchun Telegram hostlarini ochish shart emas
        <img
          src={manzil}
          alt=""
          width={56}
          height={56}
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setYuklanmadi(true)}
        />
      ) : (
        harf
      )}
    </span>
  );
}
