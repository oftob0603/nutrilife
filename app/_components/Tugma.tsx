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
  onClick,
  children,
}: {
  korinish?: Korinish;
  kichik?: boolean;
  yuklanmoqda?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || yuklanmoqda}
      className={`${kichik ? KICHIK : ASOS} ${USLUB[korinish]}`}
    >
      {yuklanmoqda && <Aylanma />}
      {children}
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
