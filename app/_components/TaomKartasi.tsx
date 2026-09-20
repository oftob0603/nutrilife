import { olchovIzohi, type Taom } from "@/lib/services/taomlar";

/** Taom rasmi hali yo'q — prototipdagidek bo'sh o'rin ko'rsatiladi. */
function RasmOrni() {
  return <div className="size-12 shrink-0 rounded-chip bg-chegara" />;
}

function OngStrelka() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-matn-3"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function TaomKartasi({ taom }: { taom: Taom }) {
  return (
    <li className="flex items-center gap-3 rounded-karta border border-chegara bg-karta p-4">
      <RasmOrni />
      <div className="min-w-0 flex-1">
        <p className="truncate text-karta-sarlavha">{taom.nomi}</p>
        <p className="mt-1 text-izoh text-matn-2 tabular-nums">{olchovIzohi(taom)}</p>
      </div>
      <OngStrelka />
    </li>
  );
}
