"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTelegramOrqaga } from "./useTelegramOrqaga";

/**
 * Ekranning orqaga tugmasi (havola yoki tugma). Telegram ichida u yashiriladi va xuddi shu
 * amalni Telegram'ning o'z orqaga tugmasi bajaradi. `joyTutsin` — yashirilganda o'rni
 * bo'sh qoladi (markazlangan sarlavhali ekranlar uchun).
 */
export function OrqagaTugma({
  nomi,
  href,
  onOrqaga,
  className,
  joyTutsin = false,
  children,
}: {
  /** Ekran o'quvchisi uchun — `t("Orqaga")`. */
  nomi: string;
  href?: string;
  onOrqaga?: () => void;
  className: string;
  joyTutsin?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  useTelegramOrqaga(href ? () => router.push(href) : onOrqaga);

  const klass = `${className} ${joyTutsin ? "telegram:invisible" : "telegram:hidden"}`;
  return href ? (
    <Link href={href} aria-label={nomi} className={klass}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onOrqaga} aria-label={nomi} className={klass}>
      {children}
    </button>
  );
}
