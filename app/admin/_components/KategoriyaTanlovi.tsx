"use client";

import { useState } from "react";
import { apiSorov } from "@/lib/services/api-klient";
import type { Kategoriya } from "@/lib/services/kategoriya-admin";
import { AdminOyna, MAYDON_SINFI, OynaYorligi } from "./AdminOyna";
import { Belgi } from "./Belgi";
import { xatoMatni } from "./ShaklMaydonlari";

/**
 * Kategoriya tanlovi va "Yangi qo'shish" oynasi (prototip `Select` + `KategoriyaDialog`) — A7 va A9
 * bitta komponent. Yangi kategoriya `/api/admin/kategoriyalar` ga tushadi va darhol tanlanadi;
 * ro'yxat ota komponentda turadi (`onRoyxat`), chunki u sahifa yuklanganda API'dan keladi.
 */
export function KategoriyaTanlovi({
  kategoriyalar,
  qiymat,
  onTanla,
  onRoyxat,
  majburiy = false,
  xato,
}: {
  kategoriyalar: Kategoriya[];
  qiymat: string;
  onTanla: (id: string) => void;
  onRoyxat: (kategoriyalar: Kategoriya[]) => void;
  majburiy?: boolean;
  xato?: string;
}) {
  const [oyna, setOyna] = useState(false);
  const [nomi, setNomi] = useState("");
  const [oynaXatosi, setOynaXatosi] = useState<string | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  async function qosh() {
    const toza = nomi.trim();
    if (!toza || yuborilmoqda) return;
    setOynaXatosi(null);
    setYuborilmoqda(true);
    try {
      const javob = await apiSorov("/api/admin/kategoriyalar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nomi: toza }),
      });
      if (!javob.ok) {
        setOynaXatosi(await xatoMatni(javob));
        return;
      }
      const { kategoriya } = (await javob.json()) as { kategoriya: Kategoriya };
      onRoyxat([...kategoriyalar, kategoriya].sort((a, b) => a.nomi.localeCompare(b.nomi, "uz")));
      onTanla(kategoriya.id);
      setOyna(false);
    } catch {
      setOynaXatosi("Qo'shib bo'lmadi. Qayta urinib ko'ring");
    } finally {
      setYuborilmoqda(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <OynaYorligi nomi="Kategoriya" majburiy={majburiy}>
          <select
            value={qiymat}
            onChange={(e) => onTanla(e.target.value)}
            aria-invalid={xato ? true : undefined}
            className={`${MAYDON_SINFI}${xato ? " border-xato" : ""}`}
          >
            <option value="">Tanlanmagan</option>
            {kategoriyalar.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nomi}
              </option>
            ))}
          </select>
        </OynaYorligi>
        {xato && <span className="text-izoh text-xato">{xato}</span>}
        <button
          type="button"
          onClick={() => {
            setNomi("");
            setOynaXatosi(null);
            setOyna(true);
          }}
          className="inline-flex min-h-11 items-center gap-2 self-start text-asosiy font-medium text-siyoh"
        >
          <Belgi nomi="plus" olcham={16} />
          {"Yangi qo'shish"}
        </button>
      </div>

      {oyna && (
        <AdminOyna
          sarlavha="Yangi kategoriya"
          izoh="Kategoriya retsept shakllarida darhol paydo bo'ladi."
          tasdiqMatni="Qo'shish"
          tasdiqOchiq={nomi.trim().length >= 2}
          yuborilmoqda={yuborilmoqda}
          onTasdiq={qosh}
          onYop={() => setOyna(false)}
        >
          <OynaYorligi nomi="Nomi" majburiy>
            <input
              type="text"
              value={nomi}
              maxLength={40}
              autoFocus
              onChange={(e) => {
                setNomi(e.target.value);
                setOynaXatosi(null);
              }}
              className={MAYDON_SINFI}
            />
          </OynaYorligi>
          {oynaXatosi && <p className="text-izoh text-xato">{oynaXatosi}</p>}
        </AdminOyna>
      )}
    </>
  );
}
