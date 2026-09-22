import Link from "next/link";

type Korinish = "asosiy" | "aksent" | "ikkilamchi" | "uchinchi" | "xavfli" | "pro";

// DESIGN.md, 6-bo'lim: balandligi 52, radius 999, bosilganda scale(0.98).
const USLUB: Record<Korinish, string> = {
  asosiy: "bg-siyoh text-fon",
  // Faqat tasdiq tugmasi uchun — ekranda bitta lime to'ldirilgan element (DESIGN.md, aksent qoidasi).
  aksent: "bg-aksent text-aksent-matn",
  ikkilamchi: "border border-chegara bg-transparent text-siyoh",
  uchinchi: "bg-transparent text-matn-2",
  // Qaytarib bo'lmaydigan amal (o'chirish) — to'ldirilmagan, faqat xato rangidagi matn.
  xavfli: "bg-transparent text-xato",
  // PRO'ga chaqiruvchi tugma — o'z gradiyentida (DESIGN.md, "PRO ranglari").
  pro: "bg-(image:--pro-gradient) text-(--pro-fg)",
};

const UMUMIY =
  "flex items-center justify-center gap-2 rounded-full text-asosiy font-medium transition-transform active:scale-[0.98] disabled:opacity-40";
const ASOS = `${UMUMIY} h-13 w-full`;
// Karta ichidagi yonma-yon tugmalar uchun (prototip `size="sm"`): balandligi 44, eni matnga qarab.
const KICHIK = `${UMUMIY} h-11 px-4`;

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
      className={`${kichik ? KICHIK : ASOS} ${USLUB[korinish]}${yorugOtish ? ` ${YORUG_OTISH}` : ""}`}
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
    <Link href={href} className={`${ASOS} ${USLUB[korinish]}`}>
      {children}
    </Link>
  );
}
