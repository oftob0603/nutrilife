import Link from "next/link";

type Korinish =
  | "asosiy"
  | "aksent"
  | "ikkilamchi"
  | "uchinchi"
  | "uchinchiXavfli"
  | "xavfli"
  | "pro";

// DESIGN.md, 6-bo'lim: balandligi 52, radius 999, bosilganda scale(0.98).
const USLUB: Record<Korinish, string> = {
  // Prototip `--btn-primary-bg: var(--aksent)` — asosiy tugma lime (DECISIONS 2026-09-23).
  asosiy: "bg-aksent text-aksent-matn",
  aksent: "bg-aksent text-aksent-matn",
  ikkilamchi: "border border-chegara bg-transparent text-siyoh",
  uchinchi: "bg-transparent text-siyoh",
  // Prototipdagi `tertiary` + `color: var(--xato)` — "Hisobni o'chirish", o'lchovni o'chirish.
  uchinchiXavfli: "bg-transparent text-xato",
  // Qaytarib bo'lmaydigan amal (o'chirish) — to'ldirilmagan, chegarali, xato rangidagi matn.
  xavfli: "border border-chegara bg-transparent text-xato",
  // PRO'ga chaqiruvchi tugma — o'z gradiyentida (DESIGN.md, "PRO ranglari").
  pro: "bg-(image:--pro-gradient) text-(--pro-fg)",
};

const UMUMIY =
  "flex items-center justify-center gap-2 rounded-full text-asosiy font-medium transition-transform active:scale-[0.98] disabled:opacity-40";
const ASOS = `${UMUMIY} w-full px-6`;
// Karta ichidagi yonma-yon tugmalar uchun (prototip `size="sm"`): balandligi 44, eni matnga qarab.
const KICHIK = `${UMUMIY} h-11 px-4`;

// Prototip: uchinchi darajali tugma doim 44 px (`minHeight: H.sm`), qolganlari 52 px.
// Eksport — havola ichidagi tugma ko'rinishi uchun (masalan, butunicha bosiladigan ProQulfi).
export function sinf(korinish: Korinish, kichik = false) {
  if (kichik) return `${KICHIK} ${USLUB[korinish]}`;
  const past = korinish === "uchinchi" || korinish === "uchinchiXavfli";
  return `${ASOS} ${past ? "h-11" : "h-13"} ${USLUB[korinish]}`;
}

// W1 "Davom etish" (prototip pw-sweep): chiziq matn ortidan o'tadi, o'chiq tugmada va
// "harakatni kamaytirish" yoqilganda yo'q.
const YORUG_OTISH =
  "relative isolate overflow-hidden after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:z-[1] after:hidden after:w-[40%] after:bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.45),transparent)] motion-safe:enabled:after:block after:animate-[yorug-otish_4000ms_cubic-bezier(0.4,0,0.2,1)_infinite]";

function Aylanma() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export function Tugma({
  korinish = "asosiy",
  kichik = false,
  yuklanmoqda = false,
  disabled = false,
  yorugOtish = false,
  onClick,
  children,
}: {
  korinish?: Korinish;
  kichik?: boolean;
  yuklanmoqda?: boolean;
  disabled?: boolean;
  /** Tugma ustidan takror o'tadigan yorug'lik — faqat W1 "Davom etish". */
  yorugOtish?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const ichi = (
    <>
      {yuklanmoqda && <Aylanma />}
      {children}
    </>
  );
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || yuklanmoqda}
      className={`${sinf(korinish, kichik)}${yorugOtish ? ` ${YORUG_OTISH}` : ""}`}
    >
      {yorugOtish ? <span className="relative z-[2] flex items-center gap-2">{ichi}</span> : ichi}
    </button>
  );
}

export function TugmaHavola({
  korinish = "asosiy",
  href,
  children,
}: {
  korinish?: Korinish;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={sinf(korinish, false)}>
      {children}
    </Link>
  );
}
