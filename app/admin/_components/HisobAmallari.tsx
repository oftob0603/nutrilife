"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tugma } from "@/app/_components/Tugma";
import { apiSorov } from "@/lib/services/api-klient";
import { ochirishTasdigi } from "@/lib/services/foydalanuvchi-admin-hisob";
import type { Tarif } from "@/lib/services/huquqlar";
import {
  BERISH_TARIFLARI,
  KUN_CHEGARASI,
  SABAB_CHEGARASI,
  UZAYTIRISH_MUDDATLARI,
} from "@/lib/services/obuna-admin-hisob";
import { AdminOyna, MAYDON_SINFI, OynaChiplar, OynaYorligi } from "./AdminOyna";

type Oyna =
  | "berish"
  | "uzaytirish"
  | "olish"
  | "blok"
  | "blokYechish"
  | "ochirish"
  | null;

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
 * uzaytirish, PRO ni olib qo'yish, bloklash (bloklanganda — blokni yechish) va ma'lumotini
 * o'chirish — har biri tasdiq oynasi va majburiy sabab bilan, o'chirishda ism qo'lda yoziladi.
 * Admin hisobida bloklash va o'chirish o'chiq (server ham rad etadi). Muvaffaqiyatda karta
 * serverdan qayta so'raladi; o'chirilgach ro'yxatga qaytiladi.
 */
export function HisobAmallari({
  foydalanuvchiId,
  ism,
  telegramId,
  admin,
  pro,
  bloklangan,
  tugash,
}: {
  foydalanuvchiId: string;
  ism: string | null;
  telegramId: string | null;
  /** Hisob admin — bloklab va o'chirib bo'lmaydi. */
  admin: boolean;
  pro: boolean;
  bloklangan: boolean;
  /** Faol PRO tugaydigan kun (matn); PRO bo'lmasa null. */
  tugash: string | null;
}) {
  const router = useRouter();
  const [oyna, setOyna] = useState<Oyna>(null);
  const [tarif, setTarif] = useState<Tarif>("oylik");
  const [muddat, setMuddat] = useState("1oy");
  const [kunlar, setKunlar] = useState("");
  const [sabab, setSabab] = useState("");
  const [tasdiq, setTasdiq] = useState("");
  const [xato, setXato] = useState<string | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  const kutilganTasdiq = ochirishTasdigi(ism, telegramId);

  function och(yangi: Exclude<Oyna, null>) {
    setSabab("");
    setKunlar("");
    setTasdiq("");
    setXato(null);
    setOyna(yangi);
  }

  function yop() {
    if (!yuborilmoqda) setOyna(null);
  }

  const kunlarKerak =
    (oyna === "berish" && tarif === "qolda") ||
    (oyna === "uzaytirish" && muddat === "boshqa");
  const kunlarSoni = Number(kunlar);
  const kunlarYaroqli =
    Number.isInteger(kunlarSoni) &&
    kunlarSoni >= 1 &&
    kunlarSoni <= KUN_CHEGARASI;
  const tasdiqMos = oyna !== "ochirish" || tasdiq.trim() === kutilganTasdiq;
  const tasdiqOchiq =
    sabab.trim() !== "" && (!kunlarKerak || kunlarYaroqli) && tasdiqMos;

  /** Oynaga qarab yo'l, metod va tana. */
  function sorov(): {
    yol: string;
    method: string;
    tana: Record<string, unknown>;
  } {
    const asos = `/api/admin/foydalanuvchilar/${foydalanuvchiId}`;
    switch (oyna) {
      case "berish":
        return {
          yol: `${asos}/obuna`,
          method: "POST",
          tana: { tarif, kunlar: kunlarKerak ? kunlarSoni : undefined, sabab },
        };
      case "uzaytirish":
        return {
          yol: `${asos}/obuna`,
          method: "PATCH",
          tana: { muddat, kunlar: kunlarKerak ? kunlarSoni : undefined, sabab },
        };
      case "olish":
        return { yol: `${asos}/obuna`, method: "DELETE", tana: { sabab } };
      case "blok":
        return { yol: `${asos}/blok`, method: "POST", tana: { sabab } };
      case "blokYechish":
        return { yol: `${asos}/blok`, method: "DELETE", tana: { sabab } };
      default:
        return {
          yol: asos,
          method: "DELETE",
          tana: { tasdiq: tasdiq.trim(), sabab },
        };
    }
  }

  async function yubor() {
    if (!oyna || !tasdiqOchiq) return;
    const { yol, method, tana } = sorov();
    const ochirish = oyna === "ochirish";

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
      // O'chirilgan hisobning kartasi yo'q — ro'yxatga; qolgan amallarda karta qayta so'raladi.
      if (ochirish) router.replace("/admin/foydalanuvchilar");
      else router.refresh();
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

  const xatoQatori = xato && (
    <p role="alert" className="text-izoh text-xato">
      {xato}
    </p>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Tugma korinish="siyoh" kichik onClick={() => och("berish")}>
          PRO berish
        </Tugma>
        <Tugma
          korinish="ikkilamchi"
          kichik
          disabled={!pro}
          onClick={() => och("uzaytirish")}
        >
          Muddatni uzaytirish
        </Tugma>
        <Tugma
          korinish="ikkilamchi"
          kichik
          disabled={!pro}
          onClick={() => och("olish")}
        >
          {"PRO ni olib qo'yish"}
        </Tugma>
        {bloklangan ? (
          <Tugma
            korinish="ikkilamchi"
            kichik
            disabled={admin}
            onClick={() => och("blokYechish")}
          >
            Blokni yechish
          </Tugma>
        ) : (
          <Tugma
            korinish="ikkilamchi"
            kichik
            disabled={admin}
            onClick={() => och("blok")}
          >
            Bloklash
          </Tugma>
        )}
        <Tugma
          korinish="uchinchiXavfli"
          kichik
          disabled={admin}
          onClick={() => och("ochirish")}
        >
          {"Ma'lumotini o'chirish"}
        </Tugma>
      </div>
      <p className="text-izoh text-matn-2">
        {admin
          ? "Admin hisobini bloklab yoki o'chirib bo'lmaydi"
          : pro
            ? "Qo'lda berilgan obuna daromad statistikasiga kirmaydi"
            : "Uzaytirish va olib qo'yish faqat faol PRO'da"}
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
          <OynaChiplar
            nomi="Tarif"
            qiymat={tarif}
            variantlar={BERISH_TARIFLARI}
            onTanla={setTarif}
          />
          {tarif === "qolda" && kunlarMaydoni}
          {sababMaydoni("Masalan: test, kompensatsiya, sovg'a")}
          {xatoQatori}
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
          <OynaChiplar
            nomi="Qancha muddatga"
            qiymat={muddat}
            variantlar={UZAYTIRISH_MUDDATLARI}
            onTanla={setMuddat}
          />
          {muddat === "boshqa" && kunlarMaydoni}
          {sababMaydoni()}
          {xatoQatori}
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
          {xatoQatori}
        </AdminOyna>
      )}

      {oyna === "blok" && (
        <AdminOyna
          sarlavha="Bloklash"
          izoh="Kirish yopiladi, ma'lumot joyida qoladi. Blokni keyin yechish mumkin."
          tasdiqMatni="Bloklash"
          tasdiqOchiq={tasdiqOchiq}
          yuborilmoqda={yuborilmoqda}
          onTasdiq={yubor}
          onYop={yop}
        >
          {sababMaydoni()}
          {xatoQatori}
        </AdminOyna>
      )}

      {oyna === "blokYechish" && (
        <AdminOyna
          sarlavha="Blokni yechish"
          izoh="Foydalanuvchi ilovani keyingi ochganda yana kira oladi."
          tasdiqMatni="Blokni yechish"
          tasdiqOchiq={tasdiqOchiq}
          yuborilmoqda={yuborilmoqda}
          onTasdiq={yubor}
          onYop={yop}
        >
          {sababMaydoni()}
          {xatoQatori}
        </AdminOyna>
      )}

      {oyna === "ochirish" && (
        <AdminOyna
          sarlavha="Ma'lumotini o'chirish"
          izoh="Profil, jurnal va rasmlar butunlay o'chadi, foydalanuvchiga bot orqali xabar boradi. Bu amalni qaytarib bo'lmaydi."
          tasdiqMatni="O'chirish"
          tasdiqOchiq={tasdiqOchiq}
          xavfli
          yuborilmoqda={yuborilmoqda}
          onTasdiq={yubor}
          onYop={yop}
        >
          <OynaYorligi
            nomi={`Tasdiqlash uchun «${kutilganTasdiq}» deb yozing`}
            majburiy
          >
            <input
              type="text"
              autoComplete="off"
              value={tasdiq}
              onChange={(e) => setTasdiq(e.target.value)}
              className={MAYDON_SINFI}
            />
          </OynaYorligi>
          {sababMaydoni()}
          {xatoQatori}
        </AdminOyna>
      )}
    </div>
  );
}
