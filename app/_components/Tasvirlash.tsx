"use client";

import { useState } from "react";
import { Tugma, TugmaHavola } from "@/app/_components/Tugma";
import {
  MATN_CHEGARASI,
  skanJami,
  type SkanJavobi,
} from "@/lib/services/skan-hisob";

/**
 * Matn bilan tasvirlash — E4 "topilmadi" holatidan chiqish yo'li. Natija hozircha sodda
 * kartada ko'rinadi; to'liq tahlil (E6) va tasdiqlash (E7) ekranlari keyingi tasklarda
 * shu oqim ustiga quriladi, shuning uchun bu yerda jurnalga qo'shish yo'q.
 */
export function Tasvirlash({ boshlangich }: { boshlangich: string }) {
  const [matn, setMatn] = useState(boshlangich);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);
  const [javob, setJavob] = useState<SkanJavobi | null>(null);

  async function yubor() {
    setYuklanmoqda(true);
    setXato(null);
    setJavob(null);
    try {
      const sorov = await fetch("/api/skan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ matn }),
      });
      const tana = (await sorov.json()) as SkanJavobi | { xato: string };
      if (!sorov.ok || "xato" in tana) {
        setXato("xato" in tana ? tana.xato : "Tahlil qilib bo'lmadi. Qayta urinib ko'ring");
      } else {
        setJavob(tana);
      }
    } catch {
      setXato("Internet bilan aloqa yo'q. Qayta urinib ko'ring");
    } finally {
      setYuklanmoqda(false);
    }
  }

  const jami = javob?.holat === "tayyor" ? skanJami(javob.natija) : null;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-izoh text-matn-2">
          Nima yedingiz? Taom nomi va taxminiy miqdorini yozing.
        </span>
        <textarea
          value={matn}
          onChange={(hodisa) => setMatn(hodisa.target.value)}
          maxLength={MATN_CHEGARASI}
          rows={4}
          placeholder="Masalan: bir kosa mastava va yarimta non"
          className="w-full resize-none rounded-karta border border-chegara bg-karta p-4 text-asosiy outline-none placeholder:text-matn-3"
        />
      </label>

      <Tugma onClick={yubor} yuklanmoqda={yuklanmoqda} disabled={!matn.trim()}>
        {yuklanmoqda ? "Tahlil qilinmoqda…" : xato ? "Qayta urinish" : "Tahlil qilish"}
      </Tugma>

      {xato && (
        <p role="alert" className="text-izoh text-xato">
          {xato}
        </p>
      )}

      {javob?.holat === "tanib_bolmadi" && (
        <div className="flex flex-col gap-3 rounded-karta border border-chegara bg-karta p-4">
          <p className="text-karta-sarlavha">Aniq taniy olmadik</p>
          <p className="text-izoh text-matn-2">
            Tasvirni aniqroq yozib qayta urining yoki taomni bazadan qo&apos;lda tanlang.
          </p>
          <TugmaHavola korinish="ikkilamchi" href="/taomlar">
            Qo&apos;lda qo&apos;shish
          </TugmaHavola>
        </div>
      )}

      {javob?.holat === "tayyor" && jami && (
        <div className="flex flex-col gap-2 rounded-karta border border-chegara bg-karta p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-karta-sarlavha">{javob.natija.taomNomi}</p>
            <span className="shrink-0 rounded-chip border border-chegara px-2 py-1 text-izoh text-matn-2">
              AI taxmini
            </span>
          </div>
          <p className="text-asosiy">
            {javob.natija.porsiyaGramm} g · {jami.kaloriya} kkal
          </p>
          <p className="text-izoh text-matn-2">
            Oqsil {jami.oqsil} g · Yog&apos; {jami.yog} g · Uglevod {jami.uglevod} g
          </p>
          <p className="text-izoh text-matn-3">
            Qiymatlar taxminiy. Tasdiqlash va jurnalga qo&apos;shish tez orada ochiladi.
          </p>
        </div>
      )}
    </div>
  );
}
