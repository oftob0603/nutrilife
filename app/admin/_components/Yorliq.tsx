import { HOLAT_NOMLARI, type FoydalanuvchiHolati } from "@/lib/services/admin-hisob";

type Ton = "ai" | "neytral" | "xato";

// Prototip `Badge`: pill, 11/500 shrift, 3px/8px ichki bo'shliq. `ai` — lime (PRO belgisi),
// `neytral` — fon rangida chegarali, `xato` — to'ldiruvsiz, xato rangida chegara va matn.
const TONLAR: Record<Ton, string> = {
  ai: "bg-aksent text-aksent-matn",
  neytral: "border border-chegara bg-fon text-matn-2",
  xato: "border border-xato text-xato",
};

export function Yorliq({ ton = "neytral", children }: { ton?: Ton; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-[3px] text-belgi ${TONLAR[ton]}`}
    >
      {children}
    </span>
  );
}

const HOLAT_TONLARI: Record<FoydalanuvchiHolati, Ton> = {
  pro: "ai",
  free: "neytral",
  bloklangan: "xato",
};

/** A2/A3 "Rol" belgisi: PRO lime, FREE neytral, Bloklangan xato rangida (prototip). */
export function HolatYorligi({ holat }: { holat: FoydalanuvchiHolati }) {
  return <Yorliq ton={HOLAT_TONLARI[holat]}>{HOLAT_NOMLARI[holat]}</Yorliq>;
}
