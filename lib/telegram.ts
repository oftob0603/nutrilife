// Telegram Mini App SDK (`telegram-web-app.js`, app/layout.tsx da yuklanadi) bilan ishlash.
// Faqat brauzerda. Telegram'dan tashqarida (lokal dev) SDK yuklansa ham initData bo'sh
// bo'ladi — `webApp()` null qaytaradi va ilova oddiy brauzerdagidek ishlaydi.

type Hodisa = "themeChanged" | "safeAreaChanged" | "contentSafeAreaChanged";

/** SDK'ning bizga kerak qismi — https://core.telegram.org/bots/webapps */
type WebApp = {
  initData: string;
  version: string;
  colorScheme: "light" | "dark";
  isVersionAtLeast(versiya: string): boolean;
  ready(): void;
  expand(): void;
  disableVerticalSwipes(): void;
  openTelegramLink(url: string): void;
  setHeaderColor(rang: string): void;
  setBackgroundColor(rang: string): void;
  setBottomBarColor(rang: string): void;
  onEvent(hodisa: Hodisa, amal: () => void): void;
  offEvent(hodisa: Hodisa, amal: () => void): void;
  BackButton: {
    show(): void;
    hide(): void;
    onClick(amal: () => void): void;
  };
};

declare global {
  interface Window {
    Telegram?: { WebApp?: WebApp };
  }
}

/** Ilova Telegram ichida ochilgan bo'lsa — SDK obyekti, aks holda null. */
export function webApp(): WebApp | null {
  const sdk = typeof window === "undefined" ? undefined : window.Telegram?.WebApp;
  return sdk && sdk.initData !== "" ? sdk : null;
}

// Orqaga tugmasi: ochiq ekran va panellar ro'yxati, oxirgisi eng ustdagi. Telegram tugmasi
// bitta, shuning uchun bosilganda faqat eng ustdagi amal ishlaydi (panel ochiq bo'lsa — avval
// panel yopiladi). Ro'yxat bo'sh bo'lsa tugma yashiriladi (asosiy ekranlar).
const orqagaAmallari: (() => void)[] = [];
let orqagaUlangan = false;

function orqagaTugmasiniYangila() {
  const sdk = webApp();
  if (!sdk) return;
  if (!orqagaUlangan) {
    sdk.BackButton.onClick(() => orqagaAmallari.at(-1)?.());
    orqagaUlangan = true;
  }
  if (orqagaAmallari.length > 0) sdk.BackButton.show();
  else sdk.BackButton.hide();
}

/** Orqaga amalini ro'yxat oxiriga qo'shadi; qaytgan funksiya uni olib tashlaydi. */
export function orqagaQosh(amal: () => void): () => void {
  orqagaAmallari.push(amal);
  orqagaTugmasiniYangila();
  return () => {
    const joyi = orqagaAmallari.lastIndexOf(amal);
    if (joyi !== -1) orqagaAmallari.splice(joyi, 1);
    orqagaTugmasiniYangila();
  };
}

/**
 * Telegram sarlavhasi, fon va pastki chiziq rangini ilova fonimizga (`--fon`) tenglaydi —
 * ranglar DESIGN.md dan, Telegram mavzusi ranglari UI'ga olinmaydi.
 */
export function ranglarniTenglashtir() {
  const sdk = webApp();
  if (!sdk) return;
  const fon = getComputedStyle(document.documentElement).getPropertyValue("--fon").trim();
  if (!/^#[0-9a-f]{6}$/i.test(fon)) return;
  if (sdk.isVersionAtLeast("6.1")) {
    sdk.setHeaderColor(fon);
    sdk.setBackgroundColor(fon);
  }
  if (sdk.isVersionAtLeast("7.10")) sdk.setBottomBarColor(fon);
}

/**
 * t.me havolasini ochadi: Telegram ichida — Telegram'ning o'zida (chat shu yerda ochiladi),
 * tashqarida (lokal dev, oddiy brauzer) — yangi oynada.
 */
export function telegramHavolaniOch(url: string) {
  const sdk = webApp();
  if (sdk) sdk.openTelegramLink(url);
  else window.open(url, "_blank", "noopener");
}
