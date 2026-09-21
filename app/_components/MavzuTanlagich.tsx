"use client";

import { useSyncExternalStore } from "react";
import { useTarjima } from "@/app/_components/TilTaminoti";
import {
  MAVZU_NOMLARI,
  MAVZULAR,
  mavzugaObuna,
  mavzuniOqi,
  mavzuniTanla,
  type Mavzu,
} from "@/lib/mavzu";

// Serverda brauzer xotirasi yo'q — birinchi chizishda standart qiymat ("tizim") turadi.
const serverdagiMavzu = (): Mavzu => "tizim";

/**
 * Mavzu tanlagich: Yorug' · Qorong'i · Tizim (profil-tz F2). Tanlov darhol qo'llanadi va
 * eslab qolinadi. "Tizim"da ilova qurilma mavzusiga CSS orqali jonli ergashadi.
 * S2'da hech bir ekranga qo'yilmagan — S3'da Sozlamalar (F2) sahifasiga ulanadi.
 */
export function MavzuTanlagich() {
  const { t } = useTarjima();
  const tanlangan = useSyncExternalStore(mavzugaObuna, mavzuniOqi, serverdagiMavzu);

  return (
    <div
      role="radiogroup"
      aria-label={t("Mavzu")}
      className="flex gap-1 rounded-chip border border-chegara bg-fon p-1"
    >
      {MAVZULAR.map((mavzu) => {
        const faol = mavzu === tanlangan;
        return (
          <button
            key={mavzu}
            type="button"
            role="radio"
            aria-checked={faol}
            onClick={() => mavzuniTanla(mavzu)}
            className={`min-h-9 flex-1 rounded-chip px-2 text-izoh transition-colors ${
              faol
                ? "bg-karta font-medium text-siyoh shadow-[inset_0_0_0_1px_var(--chegara)]"
                : "text-matn-2"
            }`}
          >
            {t(MAVZU_NOMLARI[mavzu])}
          </button>
        );
      })}
    </div>
  );
}
