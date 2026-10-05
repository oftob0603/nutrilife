"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { mavzugaObuna, mavzuniOqi, mavzuniTanla, tizimgaObuna, tizimQorongimi } from "@/lib/mavzu";
import { Belgi, type BelgiNomi } from "./Belgi";

/**
 * Chap paneldagi bo'limlar (admin-tz.md §2). `href` yo'q — bo'lim hali qurilmagan (S6 keyingi
 * tasklari): nomi ko'rinadi, bosilmaydi. `soni` — navbatda kutayotganlar, nol bo'lsa chizilmaydi.
 */
const BOLIMLAR: readonly { nomi: string; belgi: BelgiNomi; href?: string; soni?: number }[] = [
  { nomi: "Boshqaruv paneli", belgi: "layout-dashboard", href: "/admin" },
  { nomi: "Foydalanuvchilar", belgi: "users" },
  { nomi: "Takliflar navbati", belgi: "inbox" },
  { nomi: "Taomlar bazasi", belgi: "utensils" },
  { nomi: "Retseptlar", belgi: "book-open" },
  { nomi: "Statistika", belgi: "chart-line" },
  { nomi: "So'rovlar", belgi: "message-square-warning" },
  { nomi: "Narxlar", belgi: "tag" },
];

/** Hozir ekranda qorong'i mavzu turibdimi (tanlov yoki tizim bo'yicha). */
function qorongimi(): boolean {
  const mavzu = mavzuniOqi();
  return mavzu === "tizim" ? tizimQorongimi() : mavzu === "qorongi";
}

/** Mavzu o'zgarishini kuzatish (lib/mavzu.ts): tanlov va tizim sozlamasi. */
function mavzuniKuzat(xabarBer: () => void): () => void {
  const tanlovdan = mavzugaObuna(xabarBer);
  const tizimdan = tizimgaObuna(xabarBer);
  return () => {
    tanlovdan();
    tizimdan();
  };
}

/**
 * Panel qobig'i (prototip `Shell`): chapda bo'limlar, pastda mavzu tugmasi, kim kirgani va
 * chiqish; o'ngda aylanadigan kontent. 1024px dan tor ekranda panel yuqoridagi tasmaga aylanadi.
 * Mavzu ilovaniki bilan bitta (lib/mavzu.ts) — brauzer xotirasida saqlanadi.
 */
export function AdminQobiq({ ism, children }: { ism: string | null; children: React.ReactNode }) {
  const yol = usePathname();
  const router = useRouter();
  const qorongi = useSyncExternalStore(mavzuniKuzat, qorongimi, () => false);
  const [chiqilmoqda, setChiqilmoqda] = useState(false);

  function mavzuniAlmashtir() {
    mavzuniTanla(qorongi ? "yorug" : "qorongi");
  }

  async function chiq() {
    setChiqilmoqda(true);
    try {
      await fetch("/api/admin/chiqish", { method: "POST" });
    } finally {
      router.refresh();
    }
  }

  const tugmaSinfi =
    "flex min-h-11 items-center gap-3 rounded-chip px-3 text-left transition-colors lg:w-full";

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row" data-admin-page="">
      <nav
        aria-label="Bo'limlar"
        className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-chegara bg-karta px-3 py-2 lg:w-admin-yon lg:flex-col lg:items-stretch lg:overflow-visible lg:border-r lg:border-b-0 lg:px-3 lg:py-6"
      >
        <span className="shrink-0 px-3 font-display text-karta-sarlavha lg:mb-6">NutriLifer</span>
        {BOLIMLAR.map((bolim) => {
          const faol = bolim.href !== undefined && yol === bolim.href;
          const ichi = (
            <>
              <Belgi nomi={bolim.belgi} />
              <span className="min-w-0 flex-1 truncate whitespace-nowrap">{bolim.nomi}</span>
              {bolim.soni !== undefined && bolim.soni > 0 && (
                <span className="min-w-5 rounded-full bg-aksent px-2 text-center text-belgi text-aksent-matn tabular-nums">
                  {bolim.soni}
                </span>
              )}
            </>
          );
          return bolim.href ? (
            <Link
              key={bolim.nomi}
              href={bolim.href}
              aria-current={faol ? "page" : undefined}
              className={`${tugmaSinfi} shrink-0 ${faol ? "bg-fon text-karta-sarlavha text-siyoh" : "text-asosiy text-matn-2 hover:bg-fon"}`}
            >
              {ichi}
            </Link>
          ) : (
            <span
              key={bolim.nomi}
              aria-disabled="true"
              title="Keyingi tasklarda quriladi"
              className={`${tugmaSinfi} shrink-0 text-asosiy text-matn-3`}
            >
              {ichi}
            </span>
          );
        })}
        <span className="hidden flex-1 lg:block" />
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0 lg:px-3">
          <button
            type="button"
            onClick={mavzuniAlmashtir}
            title={qorongi ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
            aria-label={qorongi ? "Yorug' rejim" : "Qorong'i rejim"}
            className="grid size-11 shrink-0 place-items-center rounded-chip border border-chegara text-matn-2"
          >
            <Belgi nomi={qorongi ? "moon" : "sun"} />
          </button>
          <span className="hidden min-w-0 flex-1 truncate text-izoh text-matn-3 lg:block">
            {ism ?? "admin"} · admin
          </span>
          <button
            type="button"
            onClick={() => void chiq()}
            disabled={chiqilmoqda}
            title="Chiqish"
            aria-label="Chiqish"
            className="grid size-11 shrink-0 place-items-center rounded-chip text-matn-2 disabled:opacity-40"
          >
            <Belgi nomi="log-out" />
          </button>
        </div>
      </nav>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
