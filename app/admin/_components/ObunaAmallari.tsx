"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tugma } from "@/app/_components/Tugma";
import { apiSorov } from "@/lib/services/api-klient";
import type { Tarif } from "@/lib/services/huquqlar";
import {
  BERISH_TARIFLARI,
  KUN_CHEGARASI,
  SABAB_CHEGARASI,
  UZAYTIRISH_MUDDATLARI,
} from "@/lib/services/obuna-admin-hisob";
import { AdminOyna, MAYDON_SINFI, OynaChiplar, OynaYorligi } from "./AdminOyna";

type Oyna = "berish" | "uzaytirish" | "olish" | null;

/** Server xatosi matni; o'qilmasa umumiy matn (DESIGN.md 7-bo'lim: texnik matn ko'rsatilmaydi). */
async function xatoMatni(javob: Response): Promise<string> {
  try {
    const tana = (await javob.json()) as { xato?: unknown };
    if (typeof tana.xato === "string") return tana.xato;
  } catch {
    // tana bo'sh yoki JSON emas
  }
  return "Amal bajarilmadi. Qayta urinib ko'ring";
}

/**
 * A3 amallar tasmasi (admin-tz.md A3, prototip screens-users.jsx): PRO berish, muddatni
 * uzaytirish, PRO ni olib qo'yish — har biri tasdiq oynasi va majburiy sabab bilan. Bloklash va
 * o'chirish S6 8-taskda ulanadi, hozircha o'chiq. Muvaffaqiyatda karta serverdan qayta so'raladi.
 */
export function ObunaAmallari({
  foydalanuvchiId,
  pro,
  tugash,
}: {
  foydalanuvchiId: string;
  pro: boolean;
  /** Faol PRO tugaydigan kun (matn); PRO bo'lmasa null. */
  tugash: string | null;
}) {
  const router = useRouter();
  const [oyna, setOyna] = useState<Oyna>(null);
  const [tarif, setTarif] = useState<Tarif>("oylik");
  const [muddat, setMuddat] = useState("1oy");
  const [kunlar, setKunlar] = useState("");
  const [sabab, setSabab] = useState("");
  const [xato, setXato] = useState<string | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  function och(yangi: Exclude<Oyna, null>) {
    setSabab("");
    setKunlar("");
    setXato(null);
    setOyna(yangi);
  }

  function yop() {
    if (!yuborilmoqda) setOyna(null);
  }

  const kunlarKerak = (oyna === "berish" && tarif === "qolda") || (oyna === "uzaytirish" && muddat === "boshqa");
  const kunlarSoni = Number(kunlar);
  const kunlarYaroqli = Number.isInteger(kunlarSoni) && kunlarSoni >= 1 && kunlarSoni <= KUN_CHEGARASI;
  const tasdiqOchiq = sabab.trim() !== "" && (!kunlarKerak || kunlarYaroqli);

  async function yubor() {
    if (!oyna || !tasdiqOchiq) return;
    const yol = `/api/admin/foydalanuvchilar/${foydalanuvchiId}/obuna`;
    const tana =
      oyna === "berish"
        ? { tarif, kunlar: kunlarKerak ? kunlarSoni : undefined, sabab }
        : oyna === "uzaytirish"
          ? { muddat, kunlar: kunlarKerak ? kunlarSoni : undefined, sabab }
          : { sabab };
    const method = oyna === "berish" ? "POST" : oyna === "uzaytirish" ? "PATCH" : "DELETE";

    setYuborilmoqda(true);
    setXato(null);
    try {
      const javob = await apiSorov(yol, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tana),
      });
      if (!javob.ok) {
        setXato(await xatoMatni(javob));
        return;
      }
      setOyna(null);
      router.refresh();
    } catch {
      setXato("Internet bilan aloqa yo'q. Qayta urinib ko'ring");
    } finally {
      setYuborilmoqda(false);
    }
  }

  const sababMaydoni = (izoh?: string) => (
    <OynaYorligi nomi="Sabab" majburiy>
      <textarea
        rows={oyna === "berish" ? 3 : 2}
        value={sabab}
        maxLength={SABAB_CHEGARASI}
        onChange={(e) => setSabab(e.target.value)}
        className={`${MAYDON_SINFI} resize-y`}
      />
      {izoh && <span className="text-izoh text-matn-2">{izoh}</span>}
    </OynaYorligi>
  );

  const kunlarMaydoni = (
    <OynaYorligi nomi="Muddat, kun" majburiy>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={KUN_CHEGARASI}
        value={kunlar}
        onChange={(e) => setKunlar(e.target.value)}
        placeholder="Masalan: 45"
        className={MAYDON_SINFI}
      />
    </OynaYorligi>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Tugma korinish="siyoh" kichik onClick={() => och("berish")}>
          PRO berish
        </Tugma>
        <Tugma korinish="ikkilamchi" kichik disabled={!pro} onClick={() => och("uzaytirish")}>
          Muddatni uzaytirish
        </Tugma>
        <Tugma korinish="ikkilamchi" kichik disabled={!pro} onClick={() => och("olish")}>
          {"PRO ni olib qo'yish"}
        </Tugma>
        <button type="button" disabled title="8-taskda ulanadi" className="h-11 rounded-full border border-chegara px-4 text-asosiy font-medium text-siyoh opacity-40">
          Bloklash
        </button>
        <button type="button" disabled title="8-taskda ulanadi" className="h-11 rounded-full px-4 text-asosiy font-medium text-xato opacity-40">
          {"Ma'lumotini o'chirish"}
        </button>
      </div>
      <p className="text-izoh text-matn-2">
        {pro
          ? "Qo'lda berilgan obuna daromad statistikasiga kirmaydi"
          : "Uzaytirish va olib qo'yish faqat faol PRO'da; bloklash va o'chirish — 8-task"}
      </p>

      {oyna === "berish" && (
        <AdminOyna
          sarlavha="PRO berish"
          izoh={
            pro
              ? `Foydalanuvchi allaqachon PRO — yangi muddat ${tugash} dan keyin davom etadi. Qo'lda berilgan obuna daromad statistikasiga kirmaydi.`
              : "Qo'lda berilgan obuna daromad statistikasiga kirmaydi — manba «qo'lda» deb belgilanadi."
          }
          tasdiqMatni="PRO berish"
          tasdiqOchiq={tasdiqOchiq}
          yuborilmoqda={yuborilmoqda}
          onTasdiq={yubor}
          onYop={yop}
        >
          <OynaChiplar nomi="Tarif" qiymat={tarif} variantlar={BERISH_TARIFLARI} onTanla={setTarif} />
          {tarif === "qolda" && kunlarMaydoni}
          {sababMaydoni("Masalan: test, kompensatsiya, sovg'a")}
          {xato && <p role="alert" className="text-izoh text-xato">{xato}</p>}
        </AdminOyna>
      )}

      {oyna === "uzaytirish" && (
        <AdminOyna
          sarlavha="Muddatni uzaytirish"
          izoh={`Joriy tugash sanasi: ${tugash ?? "—"}`}
          tasdiqMatni="Uzaytirish"
          tasdiqOchiq={tasdiqOchiq}
          yuborilmoqda={yuborilmoqda}
          onTasdiq={yubor}
          onYop={yop}
        >
          <OynaChiplar nomi="Qancha muddatga" qiymat={muddat} variantlar={UZAYTIRISH_MUDDATLARI} onTanla={setMuddat} />
          {muddat === "boshqa" && kunlarMaydoni}
          {sababMaydoni()}
          {xato && <p role="alert" className="text-izoh text-xato">{xato}</p>}
        </AdminOyna>
      )}

      {oyna === "olish" && (
        <AdminOyna
          sarlavha="PRO ni olib qo'yish"
          izoh="Obuna darhol to'xtaydi va foydalanuvchi FREE limitlariga qaytadi."
          tasdiqMatni="Olib qo'yish"
          tasdiqOchiq={tasdiqOchiq}
          xavfli
          yuborilmoqda={yuborilmoqda}
          onTasdiq={yubor}
          onYop={yop}
        >
          {sababMaydoni()}
          {xato && <p role="alert" className="text-izoh text-xato">{xato}</p>}
        </AdminOyna>
      )}
    </div>
  );
}
