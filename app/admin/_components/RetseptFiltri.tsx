"use client";

import { useRouter } from "next/navigation";
import {
  HOLAT_FILTR_NOMLARI,
  HOLAT_FILTRLARI,
  type HolatFiltri,
} from "@/lib/services/retsept-admin-hisob";
import type { Kategoriya } from "@/lib/services/taom-admin";
import { MAYDON_SINFI } from "./AdminOyna";

/** Ro'yxat manzili: "hammasi" yozilmaydi, sahifa 1 dan boshlanadi. */
export function retseptlarManzili(kategoriya: string | null, holat: HolatFiltri, sahifa = 1): string {
  const params = new URLSearchParams();
  if (kategoriya) params.set("kategoriya", kategoriya);
  if (holat !== "hammasi") params.set("holat", holat);
  if (sahifa > 1) params.set("sahifa", String(sahifa));
  const satr = params.toString();
  return satr ? `/admin/retseptlar?${satr}` : "/admin/retseptlar";
}

/**
 * A8 filtr paneli (prototip `Toolbar`: `Select` + `Chip`): kategoriya tanlovi va holat chiplari.
 * Kategoriya ro'yxati mavjudlarini beradi, yangi qo'shish yo'q — bo'sh kategoriya jadvalni
 * bo'shatib qo'yardi. Holat manzilda turadi — sahifa serverda qayta so'raladi.
 */
export function RetseptFiltri({
  kategoriyalar,
  kategoriya,
  holat,
}: {
  kategoriyalar: Kategoriya[];
  kategoriya: string | null;
  holat: HolatFiltri;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={kategoriya ?? ""}
        onChange={(e) => router.replace(retseptlarManzili(e.target.value || null, holat))}
        aria-label="Kategoriya bo'yicha filtr"
        className={`${MAYDON_SINFI} w-auto min-w-[220px]`}
      >
        <option value="">Hammasi</option>
        {kategoriyalar.map((k) => (
          <option key={k.id} value={k.id}>
            {k.nomi}
          </option>
        ))}
      </select>
      {HOLAT_FILTRLARI.map((f) => (
        <button
          key={f}
          type="button"
          aria-pressed={holat === f}
          onClick={() => router.replace(retseptlarManzili(kategoriya, f))}
          className={`min-h-11 rounded-chip border px-4 text-asosiy font-medium transition-colors ${
            holat === f ? "border-siyoh bg-siyoh text-on-siyoh" : "border-chegara bg-karta text-siyoh"
          }`}
        >
          {HOLAT_FILTR_NOMLARI[f]}
        </button>
      ))}
    </div>
  );
}
