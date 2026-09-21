"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { tarjimon, type Tarjimon, type Til } from "@/lib/lugat/tarjima";

type Qiymat = { til: Til; tilniOrnat: (til: Til) => void };

const TilKonteksti = createContext<Qiymat>({ til: "uz", tilniOrnat: () => {} });

/**
 * Joriy tilni klient komponentlarga yetkazadi. `til` — server cookie'dan o'qigan qiymat.
 * `tilniOrnat` tilni darhol almashtiradi (kirish javobi boshqa til aytsa yoki Sozlamalarda
 * til o'zgarsa); server komponentlar esa `router.refresh()` dan keyin yangi tilda chiziladi.
 */
export function TilTaminoti({ til, children }: { til: Til; children: React.ReactNode }) {
  const [ornatilgan, setOrnatilgan] = useState<Til | null>(null);
  const qiymat = useMemo(
    () => ({ til: ornatilgan ?? til, tilniOrnat: setOrnatilgan }),
    [ornatilgan, til],
  );
  return <TilKonteksti.Provider value={qiymat}>{children}</TilKonteksti.Provider>;
}

/** Klient komponentlar uchun tarjimon: `const { t } = useTarjima()`. */
export function useTarjima(): Tarjimon {
  return tarjimon(useContext(TilKonteksti).til);
}

export function useTilniOrnat(): (til: Til) => void {
  return useContext(TilKonteksti).tilniOrnat;
}
