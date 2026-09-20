import Link from "next/link";

type Korinish = "asosiy" | "ikkilamchi" | "uchinchi";

// DESIGN.md, 6-bo'lim: balandligi 52, radius 999, bosilganda scale(0.98).
const USLUB: Record<Korinish, string> = {
  asosiy: "bg-siyoh text-fon",
  ikkilamchi: "border border-chegara bg-transparent text-siyoh",
  uchinchi: "bg-transparent text-matn-2",
};

const ASOS =
  "flex h-13 w-full items-center justify-center gap-2 rounded-full text-asosiy font-medium transition-transform active:scale-[0.98] disabled:opacity-40";

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
  yuklanmoqda = false,
  disabled = false,
  onClick,
  children,
}: {
  korinish?: Korinish;
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
      className={`${ASOS} ${USLUB[korinish]}`}
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
