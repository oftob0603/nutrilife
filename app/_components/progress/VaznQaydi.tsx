"use client";

import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { Ikona } from "./Ikona";
import { vaznPaneliniOch } from "./vazn-hodisa";

/** P1 dagi "Vaznni qayd etish" tugmasi — P2 panelini (`VaznPaneli`) ochadi. */
export function VaznQaydi() {
  const { t } = useTarjima();
  return (
    <Tugma onClick={() => vaznPaneliniOch()}>
      <Ikona nomi="plus" />
      {t("Vaznni qayd etish")}
    </Tugma>
  );
}
