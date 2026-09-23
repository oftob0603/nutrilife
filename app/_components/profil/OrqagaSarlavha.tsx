import { OrqagaTugma } from "@/app/_components/OrqagaTugma";

const TUGMA = "-ml-3 flex size-11 shrink-0 items-center justify-center rounded-chip text-siyoh";

function ChapStrelka() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/** Ichki ekran sarlavhasi: chapda orqaga (havola yoki tugma; Telegram'da — uning tugmasi), yonida nom. */
export function OrqagaSarlavha({
  sarlavha,
  orqagaNomi,
  href,
  onOrqaga,
}: {
  sarlavha: string;
  /** Ekran o'quvchisi uchun — `t("Orqaga")`. */
  orqagaNomi: string;
  href?: string;
  onOrqaga?: () => void;
}) {
  return (
    <header className="flex items-center gap-3 py-4">
      <OrqagaTugma nomi={orqagaNomi} href={href} onOrqaga={onOrqaga} className={TUGMA}>
        <ChapStrelka />
      </OrqagaTugma>
      <h1 className="min-w-0 truncate text-sarlavha">{sarlavha}</h1>
    </header>
  );
}
