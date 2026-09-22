"use client";

import { useEffect, useRef } from "react";
import { orqagaQosh } from "@/lib/telegram";

/**
 * Ekran yoki panel ochiq turganda Telegram'ning orqaga tugmasini ko'rsatadi va bosilganda
 * `amal` ni bajaradi. `amal` berilmasa (undefined) tugma shu komponent uchun ko'rinmaydi.
 * Telegram'dan tashqarida hech narsa qilmaydi.
 */
export function useTelegramOrqaga(amal: (() => void) | undefined) {
  const oxirgi = useRef(amal);
  useEffect(() => {
    oxirgi.current = amal;
  });

  const bor = amal !== undefined;
  useEffect(() => {
    if (!bor) return;
    return orqagaQosh(() => oxirgi.current?.());
  }, [bor]);
}
