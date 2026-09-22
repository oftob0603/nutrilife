"use client";

import { useEffect } from "react";
import { mavzugaObuna, telegramHolatiniQoy } from "@/lib/mavzu";
import { ranglarniTenglashtir, webApp } from "@/lib/telegram";

/**
 * Ilova ochilganda Telegram Mini App SDK'sini sozlaydi: tayyorlikni bildiradi, oynani to'liq
 * balandlikka yoyadi, pastga surib yopishni o'chiradi (sahifa aylantirilganda ilova yopilmasin),
 * "tizim" mavzusini Telegram mavzusiga bog'laydi va Telegram sarlavhasini ilova foniga
 * tenglaydi. Telegram'dan tashqarida (yoki SDK yuklanmasa) `MAVZU_SKRIPTI` qo'ygan
 * belgilarni olib tashlaydi — o'z orqaga tugmalarimiz qaytib chiqadi.
 */
export function TelegramUlagich() {
  useEffect(() => {
    const sdk = webApp();
    if (!sdk) {
      if (document.documentElement.dataset.telegram !== undefined) telegramHolatiniQoy(null);
      return;
    }

    telegramHolatiniQoy(sdk.colorScheme);
    ranglarniTenglashtir();
    sdk.ready();
    sdk.expand();
    if (sdk.isVersionAtLeast("7.7")) sdk.disableVerticalSwipes();

    const temaOzgardi = () => telegramHolatiniQoy(sdk.colorScheme);
    sdk.onEvent("themeChanged", temaOzgardi);
    // Mavzu (foydalanuvchi tanlovi yoki Telegram) o'zgarsa — sarlavha rangi ham.
    const obunaniBekor = mavzugaObuna(ranglarniTenglashtir);
    return () => {
      sdk.offEvent("themeChanged", temaOzgardi);
      obunaniBekor();
    };
  }, []);

  return null;
}
