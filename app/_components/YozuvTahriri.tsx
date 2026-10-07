"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTarjima } from "@/app/_components/TilTaminoti";
import { Tugma } from "@/app/_components/Tugma";
import { Maydon, YozuvFormasi } from "@/app/_components/YozuvFormasi";
import { apiSorov } from "@/lib/services/api-klient";
import {
  formaQiymatlari,
  formaTuz,
  formaXatolari,
  porsiyaniAjrat,
  type Forma,
} from "@/lib/services/yozuv-forma";
import {
  OVQAT_TURLARI,
  vaqtMatni,
  vaqtniAlmashtir,
  type Yozuv,
} from "@/lib/services/yozuv-hisob";

type Amal = "saqlash" | "nusxalash" | "ochirish";

const SARLAVHA = { "content-type": "application/json" };

/** Faqat hodisa ishlovchisidan chaqiriladi — "hozir" render paytida o'qilmaydi. */
function kelajakdami(iso: string): boolean {
  return Date.parse(iso) > Date.now();
}

/**
 * O'chirishdan oldingi tasdiq — "O'chirish" tugmasi o'rnida ochiladigan karta (prototip
 * `EditScreen`): ekran almashmaydi, forma ko'rinib turadi.
 */
function OchirishTasdigi({
  bajarilmoqda,
  onTasdiq,
  onBekor,
}: {
  bajarilmoqda: boolean;
  onTasdiq: () => void;
  onBekor: () => void;
}) {
  const { t } = useTarjima();

  useEffect(() => {
    const bosildi = (hodisa: KeyboardEvent) => {
      if (hodisa.key === "Escape") onBekor();
    };
    window.addEventListener("keydown", bosildi);
    return () => window.removeEventListener("keydown", bosildi);
  }, [onBekor]);

  return (
    <div
      role="alertdialog"
      aria-describedby="ochirish-izoh"
      className="flex flex-col gap-3 rounded-karta border border-xato bg-karta p-4"
    >
      <p id="ochirish-izoh" className="text-asosiy">
        {t("Bu yozuvni o'chiramizmi? Doira shu qiymatga kamayadi.")}
      </p>
      <div className="flex gap-2">
        <Tugma korinish="xavfli" kichik yuklanmoqda={bajarilmoqda} onClick={onTasdiq}>
          {t("O'chirish")}
        </Tugma>
        <Tugma korinish="uchinchi" kichik disabled={bajarilmoqda} onClick={onBekor}>
          {t("Bekor qilish")}
        </Tugma>
      </div>
    </div>
  );
}

/**
 * E10 — yozuv tahriri: saqlash, nusxalash, o'chirish. Amal bajarilmasa ekran yopilmaydi va
 * kiritilgan ma'lumot joyida qoladi (dizayn-tz E10). `qaytish` — kelingan ekran (E1 yoki E9).
 */
export function YozuvTahriri({ yozuv, qaytish }: { yozuv: Yozuv; qaytish: string }) {
  const router = useRouter();
  const { t } = useTarjima();
  const { miqdor, birlik } = porsiyaniAjrat(yozuv.porsiya);
  const [forma, setForma] = useState<Forma>(() =>
    formaTuz({
      ...yozuv,
      miqdor,
      ovqatTuri: OVQAT_TURLARI.find((turi) => turi === yozuv.ovqatTuri),
    }),
  );
  const asliVaqt = vaqtMatni(yozuv.vaqt);
  const [vaqt, setVaqt] = useState(asliVaqt);
  const [amal, setAmal] = useState<Amal | null>(null);
  const [xato, setXato] = useState(false);
  const [tasdiqOchiq, setTasdiqOchiq] = useState(false);
  // Kelajakdagi vaqt saqlash bosilganda tekshiriladi va vaqt o'zgarganda tozalanadi.
  const [kelajakda, setKelajakda] = useState(false);

  const xatolar = formaXatolari(forma, birlik);
  // Vaqt o'zgarmagan bo'lsa yuborilmaydi — yozuvning soniyalari va tartibi saqlansin.
  const yangiVaqt = vaqt === asliVaqt ? undefined : vaqtniAlmashtir(yozuv.vaqt, vaqt);
  const vaqtXatosi =
    yangiVaqt === null
      ? t("Vaqtni kiriting")
      : kelajakda
        ? t("Vaqt hozirgidan keyin bo'lmaydi")
        : undefined;
  const yaroqsiz = Object.keys(xatolar).length > 0 || vaqtXatosi !== undefined;
  const band = amal !== null;

  async function bajar(turi: Amal, sorov: () => Promise<string>) {
    setAmal(turi);
    setXato(false);
    try {
      router.push(await sorov());
      router.refresh();
    } catch {
      setXato(true);
      setAmal(null);
      setTasdiqOchiq(false);
    }
  }

  function saqla() {
    if (yangiVaqt && kelajakdami(yangiVaqt)) {
      setKelajakda(true);
      return;
    }
    void saqlaSorovi();
  }

  const saqlaSorovi = () =>
    bajar("saqlash", async () => {
      const { miqdor: yangiMiqdor, ...qiymatlar } = formaQiymatlari(forma);
      const javob = await apiSorov(`/api/ovqat-yozuvlari/${yozuv.id}`, {
        method: "PATCH",
        headers: SARLAVHA,
        body: JSON.stringify({
          ...qiymatlar,
          porsiya: `${yangiMiqdor} ${birlik}`,
          vaqt: yangiVaqt ?? undefined,
        }),
      });
      if (!javob.ok) throw new Error("Saqlanmadi");
      return qaytish;
    });

  // Nusxa — saqlangan yozuvning o'zi, hozirgi vaqt bilan. Yuklangan rasm ko'chmaydi:
  // rasm bitta yozuvga tegishli.
  const nusxala = () =>
    bajar("nusxalash", async () => {
      const javob = await apiSorov("/api/ovqat-yozuvlari", {
        method: "POST",
        headers: SARLAVHA,
        body: JSON.stringify({
          taomNomi: yozuv.taomNomi,
          porsiya: yozuv.porsiya,
          kaloriya: yozuv.kaloriya,
          oqsil: yozuv.oqsil,
          yog: yozuv.yog,
          uglevod: yozuv.uglevod,
          ovqatTuri: yozuv.ovqatTuri,
          manba: yozuv.manba,
        }),
      });
      if (!javob.ok) throw new Error("Nusxalanmadi");
      const { yozuv: nusxa } = (await javob.json()) as { yozuv: { id: string } };
      return `/qoshildi/${nusxa.id}`;
    });

  const ochir = () =>
    bajar("ochirish", async () => {
      const javob = await apiSorov(`/api/ovqat-yozuvlari/${yozuv.id}`, { method: "DELETE" });
      // 404 — yozuv allaqachon o'chgan: foydalanuvchi uchun natija bir xil.
      if (!javob.ok && javob.status !== 404) throw new Error("O'chirilmadi");
      return qaytish;
    });

  return (
    <>
      <YozuvFormasi
        forma={forma}
        xatolar={xatolar}
        birlik={birlik}
        bloklangan={band}
        onChange={setForma}
      />

      <Maydon
        nomi={t("Vaqt")}
        turi="vaqt"
        qiymat={vaqt}
        xato={vaqtXatosi}
        bloklangan={band}
        onChange={(matn) => {
          setVaqt(matn);
          setKelajakda(false);
        }}
      />

      <div className="flex flex-col gap-2 pt-2">
        {xato && (
          <p role="alert" className="text-center text-asosiy text-xato">
            {t("O'zgarish saqlanmadi. Qayta urinib ko'ring")}
          </p>
        )}
        <Tugma
          yuklanmoqda={amal === "saqlash"}
          disabled={yaroqsiz || band}
          onClick={saqla}
        >
          {t("Saqlash")}
        </Tugma>
        <Tugma
          korinish="ikkilamchi"
          yuklanmoqda={amal === "nusxalash"}
          disabled={band}
          onClick={nusxala}
        >
          {t("Nusxalash")}
        </Tugma>
        {tasdiqOchiq ? (
          <OchirishTasdigi
            bajarilmoqda={amal === "ochirish"}
            onTasdiq={ochir}
            onBekor={() => {
              if (amal === null) setTasdiqOchiq(false);
            }}
          />
        ) : (
          <Tugma korinish="xavfli" disabled={band} onClick={() => setTasdiqOchiq(true)}>
            {t("O'chirish")}
          </Tugma>
        )}
      </div>
    </>
  );
}
