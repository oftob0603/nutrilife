"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tugma } from "@/app/_components/Tugma";
import { apiSorov } from "@/lib/services/api-klient";
import {
  makroMatni,
  NOM_CHEGARASI,
  RAD_SABABLARI,
  SABAB_CHEGARASI,
  zichlik,
  zichlikYaroqli,
  type Nomlar,
} from "@/lib/services/taom-taklif-hisob";
import type { TaklifKartasi } from "@/lib/services/taom-takliflari";
import { AdminOyna, MAYDON_SINFI, OynaChiplar, OynaYorligi } from "./AdminOyna";

type Oyna = "yangi" | "birlashtirish" | "rad" | null;

const BOSHQA = "boshqa";

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
 * Yangi taom nomlari: foydalanuvchi o'z tilida yozgan — o'sha maydon to'ldiriladi, qolgan ikkisi
 * bo'sh (admin-tz.md A5: "foydalanuvchi bitta tilda yozgan bo'ladi").
 */
function boshlangichNomlar(karta: TaklifKartasi): Nomlar {
  return {
    nomi: karta.til === "uz" ? karta.tuzatish.taomNomi : "",
    nomiRu: karta.til === "ru" ? karta.tuzatish.taomNomi : "",
    nomiEn: karta.til === "en" ? karta.tuzatish.taomNomi : "",
  };
}

/** Birlashtirishda bazadagi nomlar asos, bo'shlari foydalanuvchi nomidan to'ldiriladi. */
function birlashtirishNomlari(karta: TaklifKartasi): Nomlar {
  const bosh = boshlangichNomlar(karta);
  const t = karta.oxshash;
  if (!t) return bosh;
  return {
    nomi: t.nomi || bosh.nomi,
    nomiRu: t.nomiRu || bosh.nomiRu,
    nomiEn: t.nomiEn || bosh.nomiEn,
  };
}

/**
 * A5 qaror tasmasi va oynalari (prototip screens-queue.jsx): "Tasdiqlash — yangi taom",
 * "Tasdiqlash — mavjudiga birlashtirish" (o'xshash topilmasa o'chiq), "Rad etish". Tasdiqlashda
 * uch til nomi to'lmaguncha tugma ochilmaydi; rad etishda sabab tanlanadi. Muvaffaqiyatda
 * karta serverdan qayta so'raladi — holat va natija ko'rinadi.
 */
export function TaklifQarori({ karta }: { karta: TaklifKartasi }) {
  const router = useRouter();
  const [oyna, setOyna] = useState<Oyna>(null);
  const [nomlar, setNomlar] = useState<Nomlar>(() => boshlangichNomlar(karta));
  const [sabab, setSabab] = useState<string>(RAD_SABABLARI[0]);
  const [boshqaSabab, setBoshqaSabab] = useState("");
  const [xato, setXato] = useState<string | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  const z = zichlik(karta.tuzatish);
  const zichlikSigadi = zichlikYaroqli(z);
  const oxshash = karta.oxshash;
  const grammda = oxshash !== null && oxshash.olchovBirligi === "g" && oxshash.olchovMiqdori > 0;

  function och(yangi: Exclude<Oyna, null>) {
    setXato(null);
    setNomlar(yangi === "birlashtirish" ? birlashtirishNomlari(karta) : boshlangichNomlar(karta));
    setOyna(yangi);
  }

  function yop() {
    if (!yuborilmoqda) setOyna(null);
  }

  const nomlarToliq = nomlar.nomi.trim() !== "" && nomlar.nomiRu.trim() !== "" && nomlar.nomiEn.trim() !== "";
  const radSababi = sabab === BOSHQA ? boshqaSabab.trim() : sabab;
  const tasdiqOchiq = oyna === "rad" ? radSababi !== "" : nomlarToliq;

  async function yubor() {
    if (!oyna || !tasdiqOchiq) return;
    const tana =
      oyna === "yangi"
        ? { qaror: "yangi", ...nomlar }
        : oyna === "birlashtirish"
          ? { qaror: "birlashtirish", taomId: oxshash?.id, ...nomlar }
          : { qaror: "rad", sabab: radSababi };

    setYuborilmoqda(true);
    setXato(null);
    try {
      const javob = await apiSorov(`/api/admin/takliflar/${karta.id}/qaror`, {
        method: "POST",
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

  const nomMaydoni = (kalit: keyof Nomlar, nomi: string) => (
    <OynaYorligi nomi={nomi} majburiy>
      <input
        type="text"
        value={nomlar[kalit]}
        maxLength={NOM_CHEGARASI}
        onChange={(e) => setNomlar((n) => ({ ...n, [kalit]: e.target.value }))}
        className={MAYDON_SINFI}
      />
    </OynaYorligi>
  );

  const nomMaydonlari = (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {nomMaydoni("nomi", "O'zbekcha")}
      {nomMaydoni("nomiRu", "Ruscha")}
      {nomMaydoni("nomiEn", "Inglizcha")}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Tugma korinish="siyoh" kichik disabled={!zichlikSigadi} onClick={() => och("yangi")}>
          Tasdiqlash — yangi taom
        </Tugma>
        <Tugma korinish="ikkilamchi" kichik disabled={!oxshash || !zichlikSigadi} onClick={() => och("birlashtirish")}>
          Tasdiqlash — mavjudiga birlashtirish
        </Tugma>
        <Tugma korinish="uchinchi" kichik onClick={() => och("rad")}>
          Rad etish
        </Tugma>
      </div>
      <p className="text-izoh text-matn-2">
        {!zichlikSigadi
          ? "Tuzatish qiymatlari baza chegarasidan oshadi — faqat rad etish mumkin"
          : oxshash
            ? `Birlashtirishda «${oxshash.nomi}» yozuvi yangilanadi`
            : "Bazada o'xshash taom topilmadi — faqat yangi taom sifatida qo'shish mumkin"}
      </p>

      {(oyna === "yangi" || oyna === "birlashtirish") && (
        <AdminOyna
          sarlavha={oyna === "birlashtirish" ? "Mavjud taomga birlashtirish" : "Yangi taom sifatida qo'shish"}
          izoh="Foydalanuvchi bitta tilda yozgan — uch til ham to'ldirilishi shart."
          tasdiqMatni="Tasdiqlash"
          tasdiqOchiq={tasdiqOchiq}
          yuborilmoqda={yuborilmoqda}
          onTasdiq={yubor}
          onYop={yop}
        >
          {nomMaydonlari}
          <p className="text-izoh text-matn-2">
            {oyna === "yangi"
              ? `100 g: ${Math.round(z.kaloriya100)} kkal · ${makroMatni(z)}. Porsiya variantlari va rasmni keyin Taomlar bazasida to'g'rilaysiz.`
              : grammda && oxshash
                ? `«${oxshash.nomi}» qiymatlari ${oxshash.olchovMiqdori} g uchun yangilanadi: ${Math.round(oxshash.kaloriya)} → ${Math.round((z.kaloriya100 * oxshash.olchovMiqdori) / 100)} kkal.`
                : `«${oxshash?.nomi ?? ""}» donada o'lchanadi — 100 g zichligi o'tkazilmaydi, faqat nomlar yangilanadi.`}
          </p>
          {xato && (
            <p role="alert" className="text-izoh text-xato">
              {xato}
            </p>
          )}
        </AdminOyna>
      )}

      {oyna === "rad" && (
        <AdminOyna
          sarlavha="Taklifni rad etish"
          izoh="Baza o'zgarmaydi, taklif yopiladi."
          tasdiqMatni="Rad etish"
          tasdiqOchiq={tasdiqOchiq}
          yuborilmoqda={yuborilmoqda}
          onTasdiq={yubor}
          onYop={yop}
        >
          <OynaChiplar
            nomi="Sabab"
            qiymat={sabab}
            variantlar={[...RAD_SABABLARI.map((s) => ({ id: s, nomi: s })), { id: BOSHQA, nomi: "Boshqa" }]}
            onTanla={setSabab}
          />
          {sabab === BOSHQA && (
            <OynaYorligi nomi="Sababni yozing" majburiy>
              <textarea
                rows={2}
                value={boshqaSabab}
                maxLength={SABAB_CHEGARASI}
                onChange={(e) => setBoshqaSabab(e.target.value)}
                className={`${MAYDON_SINFI} resize-y`}
              />
            </OynaYorligi>
          )}
          {xato && (
            <p role="alert" className="text-izoh text-xato">
              {xato}
            </p>
          )}
        </AdminOyna>
      )}
    </div>
  );
}
