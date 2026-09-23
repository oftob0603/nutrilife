"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PastkiVaraq } from "@/app/_components/PastkiVaraq";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { apiSorov } from "@/lib/services/api-klient";
import { vaznMatni } from "@/lib/services/profil-hisob";
import { sanaToliq } from "@/lib/services/yozuv-hisob";
import { farqMatni, vaznQiymati, type Progress, type VaznNuqtasi } from "@/lib/services/progress-hisob";
import { vaznPaneliniOch } from "./vazn-hodisa";


/**
 * P3 — vazn tarixi: yangidan eskiga, har qatorda oldingi o'lchovdan farq, tahrirlash va
 * o'chirish. Onboardingdagi birinchi yozuv o'chirilmaydi — u grafikning boshlang'ich nuqtasi.
 * Tahrirlash P2 panelida (`VaznPaneli`, sahifada alohida chizilgan).
 */
export function VaznTarixi({ progress }: { progress: Progress }) {
  const router = useRouter();
  const t = useTarjima();
  const { til } = t;
  const { vaznBirligi: birlik } = progress;
  const birlikNomi = birlik === "lb" ? "lb" : t.t("kg");
  const royxat = [...progress.vaznlar].reverse();
  const [ochirilayotgan, setOchirilayotgan] = useState<VaznNuqtasi | null>(null);
  const [bajarilmoqda, setBajarilmoqda] = useState(false);
  const [xato, setXato] = useState(false);

  function yop() {
    if (bajarilmoqda) return;
    setOchirilayotgan(null);
    setXato(false);
  }

  async function ochir() {
    if (!ochirilayotgan) return;
    setBajarilmoqda(true);
    setXato(false);
    try {
      const javob = await apiSorov(`/api/vazn/${ochirilayotgan.id}`, { method: "DELETE" });
      // 404 — o'lchov allaqachon o'chgan: foydalanuvchi uchun natija bir xil.
      if (!javob.ok && javob.status !== 404) throw new Error("O'chirilmadi");
      setOchirilayotgan(null);
      router.refresh();
    } catch {
      setXato(true);
    } finally {
      setBajarilmoqda(false);
    }
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {royxat.map((olchov, i) => {
          const oldingi = royxat[i + 1];
          return (
            <li
              key={olchov.id}
              className="flex flex-col gap-2 rounded-karta border border-karta-chegara bg-karta p-4"
            >
              {/* Prototipda tugmalar sarlavha bilan bir qatorda; 360 px da "15.09.2026 — 77,6 kg" sig'maydi —
                  shuning uchun tugmalar alohida qatorda, o'ngda. */}
              <div className="flex flex-col gap-1">
                <span className="whitespace-nowrap text-karta-sarlavha tabular-nums">
                  {sanaToliq(olchov.sana)} — {vaznMatni(olchov.vazn, birlik, t)}
                </span>
                {/* Prototipdagidek farq sarlavha ostida. */}
                <span className="text-izoh text-matn-2 tabular-nums">
                  {oldingi
                    ? `${farqMatni(vaznQiymati(olchov.vazn - oldingi.vazn, birlik), til, birlik === "kg")} ${birlikNomi}`
                    : t.t("boshlang'ich yozuv")}
                </span>
              </div>
              <div className="-mr-2 -mb-2 flex justify-end gap-2">
                <Tugma
                  korinish="uchinchi"
                  kichik
                  onClick={() => vaznPaneliniOch({ id: olchov.id, vazn: olchov.vazn, sana: olchov.sana })}
                >
                  {t.t("Tahrirlash")}
                </Tugma>
                {!olchov.birinchi && (
                  <Tugma korinish="uchinchiXavfli" kichik onClick={() => setOchirilayotgan(olchov)}>
                    {t.t("O'chirish")}
                  </Tugma>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-izoh text-matn-2">
        {t.t("Onboardingdagi birinchi yozuv o'chirilmaydi — u grafikning boshlang'ich nuqtasi.")}
      </p>

      {ochirilayotgan && (
        <PastkiVaraq sarlavha={t.t("O'lchovni o'chirish")} onYop={yop}>
          <div className="flex flex-col gap-3">
            <p className="text-asosiy text-matn-2 tabular-nums">
              {t.t(
                "{0} · {1} o'chiriladi. Kunlik norma qayta hisoblanadi.",
                sanaToliq(ochirilayotgan.sana),
                vaznMatni(ochirilayotgan.vazn, birlik, t),
              )}
            </p>
            {xato && (
              <p role="alert" className="text-center text-asosiy text-xato">
                {t.t("O'chirilmadi. Qayta urinib ko'ring")}
              </p>
            )}
            <Tugma yuklanmoqda={bajarilmoqda} onClick={ochir}>
              {t.t("O'chirish")}
            </Tugma>
            <Tugma korinish="uchinchi" disabled={bajarilmoqda} onClick={yop}>
              {t.t("Bekor qilish")}
            </Tugma>
          </div>
        </PastkiVaraq>
      )}
    </>
  );
}
