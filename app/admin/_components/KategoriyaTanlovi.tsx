"use client";

import { useState } from "react";
import { apiSorov } from "@/lib/services/api-klient";
import type { Kategoriya, KategoriyaOqibati } from "@/lib/services/kategoriya-admin";
import { AdminOyna, MAYDON_SINFI, OynaYorligi } from "./AdminOyna";
import { Belgi } from "./Belgi";
import { xatoMatni } from "./ShaklMaydonlari";

type Oyna = { tur: "qoshish" } | { tur: "ochirish"; oqibat: KategoriyaOqibati | null };

/**
 * Kategoriya tanlovi, "Yangi qo'shish" oynasi (prototip `Select` + `KategoriyaDialog`) va
 * tanlangan kategoriyani o'chirish (prototipda yo'q — egasining so'rovi 2026-10-07, xavfli oyna
 * bilan). Yangi kategoriya `/api/admin/kategoriyalar` ga tushadi va darhol tanlanadi; o'chirish
 * `DELETE /api/admin/kategoriyalar/<id>` — bog'langan retseptlar kategoriyasiz qoladi. Ro'yxat ota
 * komponentda turadi (`onRoyxat`), chunki u sahifa yuklanganda API'dan keladi.
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
  const [oyna, setOyna] = useState<Oyna | null>(null);
  const [nomi, setNomi] = useState("");
  const [oynaXatosi, setOynaXatosi] = useState<string | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  const tanlangan = kategoriyalar.find((k) => k.id === qiymat) ?? null;

  function yop() {
    if (!yuborilmoqda) setOyna(null);
  }

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
      setOyna(null);
    } catch {
      setOynaXatosi("Qo'shib bo'lmadi. Qayta urinib ko'ring");
    } finally {
      setYuborilmoqda(false);
    }
  }

  /** O'chirish oynasi: avval bog'langan retseptlar soni olinadi — oqibat ko'rinib tursin. */
  async function ochirishniOch() {
    if (!tanlangan) return;
    setOynaXatosi(null);
    setOyna({ tur: "ochirish", oqibat: null });
    try {
      const javob = await apiSorov(`/api/admin/kategoriyalar/${tanlangan.id}`);
      if (!javob.ok) {
        setOynaXatosi(await xatoMatni(javob));
        return;
      }
      setOyna({ tur: "ochirish", oqibat: (await javob.json()) as KategoriyaOqibati });
    } catch {
      setOynaXatosi("Yuklab bo'lmadi. Qayta urinib ko'ring");
    }
  }

  async function ochir() {
    if (!tanlangan || yuborilmoqda) return;
    setOynaXatosi(null);
    setYuborilmoqda(true);
    try {
      const javob = await apiSorov(`/api/admin/kategoriyalar/${tanlangan.id}`, { method: "DELETE" });
      if (!javob.ok) {
        setOynaXatosi(await xatoMatni(javob));
        return;
      }
      onRoyxat(kategoriyalar.filter((k) => k.id !== tanlangan.id));
      onTanla("");
      setOyna(null);
    } catch {
      setOynaXatosi("O'chirib bo'lmadi. Qayta urinib ko'ring");
    } finally {
      setYuborilmoqda(false);
    }
  }

  const TUGMA = "inline-flex min-h-11 items-center gap-2 text-asosiy font-medium";

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
        <div className="flex flex-wrap items-center gap-x-5">
          <button
            type="button"
            onClick={() => {
              setNomi("");
              setOynaXatosi(null);
              setOyna({ tur: "qoshish" });
            }}
            className={`${TUGMA} text-siyoh`}
          >
            <Belgi nomi="plus" olcham={16} />
            {"Yangi qo'shish"}
          </button>
          <button
            type="button"
            disabled={!tanlangan}
            onClick={ochirishniOch}
            title={tanlangan ? undefined : "O'chirish uchun avval kategoriyani tanlang"}
            className={`${TUGMA} text-xato disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <Belgi nomi="trash-2" olcham={16} />
            {"O'chirish"}
          </button>
        </div>
      </div>

      {oyna?.tur === "qoshish" && (
        <AdminOyna
          sarlavha="Yangi kategoriya"
          izoh="Kategoriya retsept shakllarida darhol paydo bo'ladi."
          tasdiqMatni="Qo'shish"
          tasdiqOchiq={nomi.trim().length >= 2}
          yuborilmoqda={yuborilmoqda}
          onTasdiq={qosh}
          onYop={yop}
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

      {oyna?.tur === "ochirish" && tanlangan && (
        <AdminOyna
          sarlavha={`«${tanlangan.nomi}» kategoriyasi o'chirilsinmi?`}
          izoh="Bu amalni qaytarib bo'lmaydi. Retseptlarning o'zi o'chmaydi."
          tasdiqMatni="O'chirish"
          tasdiqOchiq={oyna.oqibat !== null}
          xavfli
          yuborilmoqda={yuborilmoqda}
          onTasdiq={ochir}
          onYop={yop}
        >
          <p className="text-asosiy text-matn-2">
            {oyna.oqibat === null
              ? "Bog'langan retseptlar hisoblanmoqda…"
              : oyna.oqibat.retseptlar === 0
                ? "Bu kategoriyaga bog'langan retsept yo'q."
                : `Bog'langan ${oyna.oqibat.retseptlar} ta retsept kategoriyasiz qoladi: ilovada faqat «Hammasi» chipida chiqadi, chop etilganini keyingi saqlashda yangi kategoriya tanlash kerak bo'ladi.`}
          </p>
          {oynaXatosi && <p className="text-izoh text-xato">{oynaXatosi}</p>}
        </AdminOyna>
      )}
    </>
  );
}
