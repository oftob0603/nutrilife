"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  birlamchiPorsiya,
  porsiyaHisobi,
  raqam,
  type Taom,
} from "@/lib/services/taom-hisob";
import { OVQAT_TURLARI, type OvqatTuri } from "@/lib/services/yozuv-hisob";
import { apiSorov } from "@/lib/services/api-klient";
import { OvqatTuriTanlagich } from "@/app/_components/OvqatTuriTanlagich";
import { Tugma } from "@/app/_components/Tugma";

function Chip({
  tanlangan,
  onClick,
  children,
}: {
  tanlangan: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={tanlangan}
      className={`min-h-11 rounded-chip border px-4 text-asosiy font-medium tabular-nums transition-colors ${
        tanlangan
          ? "border-siyoh bg-siyoh text-fon"
          : "border-chegara bg-karta text-siyoh"
      }`}
    >
      {children}
    </button>
  );
}

function Makro({ nomi, qiymat }: { nomi: string; qiymat: number }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-izoh text-matn-2">{nomi}</span>
      <span className="text-asosiy tabular-nums">{qiymat} g</span>
    </div>
  );
}

export function PorsiyaTanlagich({ taom }: { taom: Taom }) {
  const router = useRouter();
  const [porsiya, setPorsiya] = useState(() => birlamchiPorsiya(taom));
  const [boshqa, setBoshqa] = useState("");
  const [ovqatTuri, setOvqatTuri] = useState<OvqatTuri>(OVQAT_TURLARI[1]);
  const [saqlanmoqda, setSaqlanmoqda] = useState(false);
  const [xato, setXato] = useState(false);

  // Tekshiruv yo'q (S1): kiritilgan matn songa aylantiriladi, bo'lmasa nol.
  const miqdor = boshqa ? Number(boshqa) || 0 : porsiya;
  const hisob = porsiyaHisobi(taom, miqdor);

  async function jurnalgaQosh() {
    setSaqlanmoqda(true);
    setXato(false);
    try {
      const javob = await apiSorov("/api/ovqat-yozuvlari", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taomId: taom.id,
          taomNomi: taom.nomi,
          porsiya: hisob.belgisi,
          kaloriya: hisob.kaloriya,
          oqsil: hisob.oqsil,
          yog: hisob.yog,
          uglevod: hisob.uglevod,
          ovqatTuri,
        }),
      });
      if (!javob.ok) throw new Error("Saqlanmadi");
      const { yozuv } = (await javob.json()) as { yozuv: { id: string } };
      router.push(`/qoshildi/${yozuv.id}`);
    } catch {
      // Kiritilgan ma'lumot joyida qoladi, ekran yopilmaydi (dizayn-tz E5).
      setXato(true);
      setSaqlanmoqda(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1">
        <span className="font-display text-raqam tabular-nums">
          {raqam(hisob.kaloriya)}
        </span>
        <span className="text-izoh text-matn-2 tabular-nums">
          kkal · {hisob.belgisi}
        </span>
      </div>

      <div className="flex gap-4">
        <Makro nomi="Oqsil" qiymat={hisob.oqsil} />
        <Makro nomi="Yog'" qiymat={hisob.yog} />
        <Makro nomi="Uglevod" qiymat={hisob.uglevod} />
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-karta-sarlavha">Porsiya</h2>
        <div className="flex flex-wrap gap-2">
          {taom.porsiyalar.map((variant) => (
            <Chip
              key={variant}
              tanlangan={!boshqa && porsiya === variant}
              onClick={() => {
                setBoshqa("");
                setPorsiya(variant);
              }}
            >
              {variant} {taom.olchovBirligi}
            </Chip>
          ))}
          <label className="flex min-h-11 w-32 items-center gap-2 rounded-chip border border-chegara bg-karta px-4">
            <span className="sr-only">Boshqa miqdor</span>
            <input
              type="number"
              inputMode="numeric"
              value={boshqa}
              onChange={(hodisa) => setBoshqa(hodisa.target.value)}
              placeholder="Boshqa"
              className="w-full min-w-0 bg-transparent text-asosiy tabular-nums outline-none placeholder:text-matn-3"
            />
            <span className="shrink-0 text-izoh text-matn-2">
              {taom.olchovBirligi}
            </span>
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-karta-sarlavha">Ovqat turi</h2>
        <OvqatTuriTanlagich qiymat={ovqatTuri} onChange={setOvqatTuri} />
      </section>

      <Tugma yuklanmoqda={saqlanmoqda} onClick={jurnalgaQosh}>
        Jurnalga qo&apos;shish
      </Tugma>

      {xato && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-karta border border-xato p-4"
        >
          <p className="flex-1 text-asosiy text-xato">
            Saqlanmadi. Qayta urinib ko&apos;ring
          </p>
          <button
            type="button"
            onClick={jurnalgaQosh}
            className="min-h-11 rounded-chip px-4 text-asosiy font-medium text-siyoh"
          >
            Qayta urinish
          </button>
        </div>
      )}
    </div>
  );
}
