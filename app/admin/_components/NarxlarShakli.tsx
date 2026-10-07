"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tugma } from "@/app/_components/Tugma";
import { tarifMatni } from "@/lib/services/admin-hisob";
import { som } from "@/lib/services/admin-statistika-hisob";
import { apiSorov } from "@/lib/services/api-klient";
import { narxniOqi, narxXatosi, type NarxSorovi } from "@/lib/services/narxlar-admin-hisob";
import { TARIF_IDLARI, type TarifId, type TarifNarxi } from "@/lib/tariflar";
import { AdminOyna } from "./AdminOyna";
import { AdminSahifa } from "./AdminSahifa";
import { Karta, Maydon } from "./ShaklMaydonlari";

/** Server xatosi matni; o'qilmasa umumiy matn (DESIGN.md 7-bo'lim: texnik matn ko'rsatilmaydi). */
async function xatoMatni(javob: Response): Promise<string> {
  try {
    const tana = (await javob.json()) as { xato?: unknown };
    if (typeof tana.xato === "string") return tana.xato;
  } catch {
    // tana bo'sh yoki JSON emas
  }
  return "Saqlab bo'lmadi. Qayta urinib ko'ring";
}

function boshlangichQiymatlar(tariflar: TarifNarxi[]): Record<TarifId, string> {
  const qiymatlar = {} as Record<TarifId, string>;
  for (const id of TARIF_IDLARI) qiymatlar[id] = String(tariflar.find((t) => t.id === id)?.narx ?? "");
  return qiymatlar;
}

/**
 * A12 — narxlar (admin-tz.md, prototip screens-dash.jsx A12): uch tarif kartasi so'mda, sarlavhada
 * "Saqlash", tasdiq oynasida eski → yangi ro'yxat. Narx o'zgarishi mavjud obunalarga ta'sir
 * qilmaydi — bu eslatma sahifada ham, oynada ham. Muvaffaqiyatda sahifa serverdan qayta so'raladi.
 */
export function NarxlarShakli({ tariflar }: { tariflar: TarifNarxi[] }) {
  const router = useRouter();
  const [qiymatlar, setQiymatlar] = useState(() => boshlangichQiymatlar(tariflar));
  const [oynaOchiq, setOynaOchiq] = useState(false);
  const [xato, setXato] = useState<string | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  const joriy = (id: TarifId) => tariflar.find((t) => t.id === id)?.narx ?? 0;
  const xatolar = Object.fromEntries(TARIF_IDLARI.map((id) => [id, narxXatosi(qiymatlar[id])])) as Record<
    TarifId,
    string | undefined
  >;
  const yaroqli = TARIF_IDLARI.every((id) => xatolar[id] === undefined);
  const ozgargan = TARIF_IDLARI.some((id) => narxniOqi(qiymatlar[id]) !== joriy(id));

  function ozgartir(id: TarifId, qiymat: string) {
    // Prototip: faqat raqamlar qoladi.
    setQiymatlar((q) => ({ ...q, [id]: qiymat.replace(/\D/g, "") }));
  }

  async function saqla() {
    if (!yaroqli || !ozgargan) return;
    const tana = {} as NarxSorovi;
    for (const id of TARIF_IDLARI) tana[id] = narxniOqi(qiymatlar[id]);

    setYuborilmoqda(true);
    setXato(null);
    try {
      const javob = await apiSorov("/api/admin/narxlar", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tana),
      });
      if (!javob.ok) {
        setXato(await xatoMatni(javob));
        return;
      }
      setOynaOchiq(false);
      router.refresh();
    } catch {
      setXato("Internet bilan aloqa yo'q. Qayta urinib ko'ring");
    } finally {
      setYuborilmoqda(false);
    }
  }

  return (
    <AdminSahifa
      sarlavha="Narxlar"
      izoh="PRO tariflari, so'mda. Yangi narx faqat yangi to'lovlarga qo'llanadi"
      amallar={
        <Tugma korinish="siyoh" kichik disabled={!yaroqli || !ozgargan} onClick={() => { setXato(null); setOynaOchiq(true); }}>
          Saqlash
        </Tugma>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {TARIF_IDLARI.map((id) => (
          <Karta key={id} sarlavha={tarifMatni(id)}>
            <Maydon nomi="Narx" qiymat={qiymatlar[id]} onChange={(v) => ozgartir(id, v)} birlik="so'm" raqam xato={xatolar[id]} />
            <span className="text-izoh text-matn-2">
              {`Hozir ${som(joriy(id))}`}
              {id === "yillik" && " · W1 da «Tavsiya etiladi»"}
            </span>
          </Karta>
        ))}
      </div>

      {/* Prototip `Note`: sarlavha va matn, karta chegarasida. */}
      <div role="note" className="flex flex-col gap-1 rounded-karta border border-karta-chegara bg-karta p-4">
        <span className="text-asosiy font-medium text-siyoh">{"Narx o'zgarishi mavjud obunalarga ta'sir qilmaydi"}</span>
        <span className="text-izoh text-matn-2">
          {"Faol obuna o'z narxi bilan muddati tugaguncha ishlaydi. Yangi narx faqat yangi to'lovlarga qo'llanadi."}
        </span>
      </div>

      {oynaOchiq && (
        <AdminOyna
          sarlavha="Narxlarni o'zgartirish"
          izoh="Narx o'zgarishi mavjud obunalarga ta'sir qilmaydi — faol obunalar o'z narxi bilan muddati tugaguncha ishlaydi."
          tasdiqMatni="Tasdiqlash"
          tasdiqOchiq={yaroqli && ozgargan}
          yuborilmoqda={yuborilmoqda}
          onTasdiq={saqla}
          onYop={() => {
            if (!yuborilmoqda) setOynaOchiq(false);
          }}
        >
          <div className="flex flex-col gap-2">
            {TARIF_IDLARI.map((id) => {
              const yangi = narxniOqi(qiymatlar[id]);
              const ozgardi = yangi !== joriy(id);
              return (
                <span key={id} className={`flex justify-between gap-3 text-asosiy ${ozgardi ? "" : "text-matn-3"}`}>
                  <span>{tarifMatni(id)}</span>
                  <span className="tabular-nums text-matn-2">
                    {som(joriy(id))}
                    {" → "}
                    <span className={ozgardi ? "text-siyoh" : undefined}>{som(yangi)}</span>
                  </span>
                </span>
              );
            })}
          </div>
          {xato && (
            <p role="alert" className="text-izoh text-xato">
              {xato}
            </p>
          )}
        </AdminOyna>
      )}
    </AdminSahifa>
  );
}
