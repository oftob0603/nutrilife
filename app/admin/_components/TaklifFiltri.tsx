"use client";

import { useRouter } from "next/navigation";
import {
  FILTR_MATNLARI,
  TAKLIF_FILTRLARI,
  type TaklifFiltri as Filtr,
} from "@/lib/services/taom-taklif-hisob";

/** A4 ro'yxat manzili: standart filtr ("yangi") va 1-sahifa yozilmaydi. */
export function takliflarManzili(holat: Filtr, sahifa = 1): string {
  const params = new URLSearchParams();
  if (holat !== "yangi") params.set("holat", holat);
  if (sahifa > 1) params.set("sahifa", String(sahifa));
  const satr = params.toString();
  return satr ? `/admin/takliflar?${satr}` : "/admin/takliflar";
}

/** A4 filtr chiplari (prototip `Chip`): holat manzilda turadi, sahifa serverda qayta so'raladi. */
export function TaklifFiltri({ holat }: { holat: Filtr }) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TAKLIF_FILTRLARI.map((f) => (
        <button
          key={f}
          type="button"
          aria-pressed={holat === f}
          onClick={() => router.replace(takliflarManzili(f))}
          className={`min-h-11 rounded-chip border px-4 text-asosiy font-medium transition-colors ${
            holat === f ? "border-siyoh bg-siyoh text-on-siyoh" : "border-chegara bg-karta text-siyoh"
          }`}
        >
          {FILTR_MATNLARI[f]}
        </button>
      ))}
    </div>
  );
}
