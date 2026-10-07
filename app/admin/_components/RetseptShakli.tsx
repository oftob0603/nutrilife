"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sinf, Tugma } from "@/app/_components/Tugma";
import { apiSorov } from "@/lib/services/api-klient";
import { rasmniSiq } from "@/lib/services/rasm-yuklash";
import type { RetseptKartasi } from "@/lib/services/retsept-admin";
import {
  type Amal,
  chopEtishKamchiliklari,
  HOLAT_NOMLARI,
  kamchilikXabari,
  MURAKKABLIK_NOMLARI,
  MURAKKABLIKLAR,
  type Murakkablik,
  murakkablikniOqi,
  NOM_CHEGARASI,
  PORSIYA_CHEGARASI,
  qatorlargaBol,
  qatorlarMatni,
  sonMatni,
  TIL_NOMLARI,
  TIL_QOSHIMCHASI,
  TILLAR,
  type Til,
} from "@/lib/services/retsept-admin-hisob";
import type { Kategoriya } from "@/lib/services/taom-admin";
import { MAYDON_SINFI, OynaChiplar, OynaYorligi } from "./AdminOyna";
import { AdminSahifa } from "./AdminSahifa";
import { Belgi } from "./Belgi";
import { KategoriyaTanlovi } from "./KategoriyaTanlovi";
import { Karta, Maydon, son, xatoMatni } from "./ShaklMaydonlari";
import { Yorliq } from "./Yorliq";

/** Shakl holati: matnlar textarea ko'rinishida (har qatorda bitta masalliq/qadam). */
type Qiymatlar = {
  nomi: Record<Til, string>;
  kategoriyaId: string;
  kaloriya: string;
  oqsil: string;
  yog: string;
  uglevod: string;
  porsiya: string;
  vaqtDaqiqa: string;
  murakkablik: Murakkablik | "";
  masalliqlar: Record<Til, string>;
  qadamlar: Record<Til, string>;
};

const BOSH_MATNLAR: Record<Til, string> = { uz: "", ru: "", en: "" };

const BOSH: Qiymatlar = {
  nomi: BOSH_MATNLAR,
  kategoriyaId: "",
  kaloriya: "",
  oqsil: "",
  yog: "",
  uglevod: "",
  porsiya: "",
  vaqtDaqiqa: "",
  murakkablik: "",
  masalliqlar: BOSH_MATNLAR,
  qadamlar: BOSH_MATNLAR,
};

const MURAKKABLIK_VARIANTLARI = MURAKKABLIKLAR.map((m) => ({ id: m, nomi: MURAKKABLIK_NOMLARI[m] }));

function boshlangich(r: RetseptKartasi | null): Qiymatlar {
  if (!r) return BOSH;
  return {
    nomi: { uz: r.nomi, ru: r.nomiRu, en: r.nomiEn },
    kategoriyaId: r.kategoriyaId ?? "",
    kaloriya: sonMatni(r.kaloriya),
    oqsil: sonMatni(r.oqsil),
    yog: sonMatni(r.yog),
    uglevod: sonMatni(r.uglevod),
    porsiya: r.porsiya,
    vaqtDaqiqa: r.vaqtDaqiqa === null ? "" : String(r.vaqtDaqiqa),
    murakkablik: murakkablikniOqi(r.murakkablik) ?? "",
    masalliqlar: { uz: qatorlarMatni(r.masalliqlar.uz), ru: qatorlarMatni(r.masalliqlar.ru), en: qatorlarMatni(r.masalliqlar.en) },
    qadamlar: { uz: qatorlarMatni(r.qadamlar.uz), ru: qatorlarMatni(r.qadamlar.ru), en: qatorlarMatni(r.qadamlar.en) },
  };
}

/** Bo'sh — null; aks holda son (NaN bo'lishi mumkin). */
function sonYokiBosh(matn: string): number | null {
  return matn.trim() === "" ? null : son(matn);
}

/** Qatorlar soni ko'rsatkichi: "7 ta masalliq". */
function sanoq(matn: string, nom: string): string {
  return `${qatorlargaBol(matn).length} ta ${nom}`;
}

/** Ko'p qatorli maydon (prototip `Textarea`): yorliq, joy matni, ostida ko'rsatkich. */
function KopQatorli({
  nomi,
  qiymat,
  onChange,
  qatorlar,
  joyMatni,
  korsatkich,
}: {
  nomi: string;
  qiymat: string;
  onChange: (qiymat: string) => void;
  qatorlar: number;
  joyMatni: string;
  korsatkich: string;
}) {
  return (
    <OynaYorligi nomi={nomi}>
      <textarea
        rows={qatorlar}
        value={qiymat}
        onChange={(e) => onChange(e.target.value)}
        placeholder={joyMatni}
        className={`${MAYDON_SINFI} resize-y`}
      />
      <span className="text-izoh text-matn-2">{korsatkich}</span>
    </OynaYorligi>
  );
}

/**
 * A9 — retsept muharriri (admin-tz.md, prototip screens-content.jsx). Yuqorida til tanlovi: nomi,
 * masalliqlar va qadamlar tanlangan tilda tahrirlanadi, qolgan maydonlar tilga bog'liq emas.
 * "Sarlavha" kartasi FREE'ga ko'rinadi, "Masalliqlar va qadamlar" PRO ostida — belgi sarlavhada.
 * Qoralama uchun faqat o'zbekcha nom kerak; chop etish uchun retsept to'liq bo'lishi shart
 * (`chopEtishKamchiliklari`) — "Chop etish" yetishmayotganini ko'rsatib o'chiq turadi.
 * `retsept` null — yangi (POST), aks holda tahrir (PATCH, id o'zgarmaydi).
 */
export function RetseptShakli({
  retsept,
  kategoriyalar: boshlangichKategoriyalar,
}: {
  retsept: RetseptKartasi | null;
  kategoriyalar: Kategoriya[];
}) {
  const router = useRouter();
  const [v, setV] = useState<Qiymatlar>(() => boshlangich(retsept));
  const [kategoriyalar, setKategoriyalar] = useState(boshlangichKategoriyalar);
  const [til, setTil] = useState<Til>("uz");
  const [tegildi, setTegildi] = useState(false);
  const [xato, setXato] = useState<string | null>(null);
  const [yuborilayotgan, setYuborilayotgan] = useState<Amal | null>(null);

  // Rasm: tanlangan fayl (siqilgan) va uning ko'rinishi; tanlanmagan bo'lsa bazadagi rasm.
  const [rasm, setRasm] = useState<Blob | null>(null);
  const [korinish, setKorinish] = useState<string | null>(null);
  const [rasmXatosi, setRasmXatosi] = useState<string | null>(null);
  const faylMaydoni = useRef<HTMLInputElement>(null);
  useEffect(() => () => void (korinish && URL.revokeObjectURL(korinish)), [korinish]);

  const set = (kalit: keyof Qiymatlar) => (qiymat: string) => setV((s) => ({ ...s, [kalit]: qiymat }));
  const setTilda = (kalit: "nomi" | "masalliqlar" | "qadamlar") => (qiymat: string) =>
    setV((s) => ({ ...s, [kalit]: { ...s[kalit], [til]: qiymat } }));

  const chopEtilgan = retsept?.holat === "chop_etilgan";

  const kaloriya = sonYokiBosh(v.kaloriya);
  const oqsil = sonYokiBosh(v.oqsil);
  const yog = sonYokiBosh(v.yog);
  const uglevod = sonYokiBosh(v.uglevod);
  const vaqt = sonYokiBosh(v.vaqtDaqiqa);

  // To'ldirilgan maydon yaroqli bo'lishi shart; bo'sh — qoralamada mumkin.
  const xatolar = {
    nomi: !v.nomi.uz.trim() ? "O'zbekcha nomi majburiy" : undefined,
    kaloriya: kaloriya !== null && !(kaloriya >= 0) ? "Son kiriting" : undefined,
    oqsil: oqsil !== null && !(oqsil >= 0) ? "Son kiriting" : undefined,
    yog: yog !== null && !(yog >= 0) ? "Son kiriting" : undefined,
    uglevod: uglevod !== null && !(uglevod >= 0) ? "Son kiriting" : undefined,
    vaqt: vaqt !== null && !(Number.isInteger(vaqt) && vaqt > 0) ? "Daqiqada butun son" : undefined,
  };
  const yaroqli = Object.values(xatolar).every((x) => x === undefined);

  const kamchiliklar = chopEtishKamchiliklari({
    nomi: v.nomi.uz,
    nomiRu: v.nomi.ru,
    nomiEn: v.nomi.en,
    kategoriyaId: v.kategoriyaId || null,
    kaloriya: kaloriya !== null && Number.isFinite(kaloriya) ? kaloriya : null,
    vaqtDaqiqa: vaqt !== null && Number.isFinite(vaqt) ? vaqt : null,
    murakkablik: v.murakkablik || null,
    masalliqlar: { uz: qatorlargaBol(v.masalliqlar.uz), ru: qatorlargaBol(v.masalliqlar.ru), en: qatorlargaBol(v.masalliqlar.en) },
  });
  const toliq = yaroqli && kamchiliklar.length === 0;

  async function rasmTanlandi(fayl: File | undefined) {
    if (!fayl) return;
    setRasmXatosi(null);
    try {
      const siqilgan = await rasmniSiq(fayl);
      if (korinish) URL.revokeObjectURL(korinish);
      setRasm(siqilgan);
      setKorinish(URL.createObjectURL(siqilgan));
    } catch (x) {
      setRasmXatosi(x instanceof Error ? x.message : "Rasmni o'qib bo'lmadi");
    }
  }

  async function saqla(amal: Amal) {
    setTegildi(true);
    if (yuborilayotgan) return;
    // Chop etilgan retsept to'liq qoladi; qoralama faqat o'zbekcha nom bilan saqlanadi.
    if (amal === "chop_etish" || chopEtilgan ? !toliq : !yaroqli) {
      if (yaroqli && kamchiliklar.length > 0) setXato(kamchilikXabari(kamchiliklar));
      return;
    }
    setXato(null);
    setYuborilayotgan(amal);

    const shakl = new FormData();
    shakl.append("nomi", v.nomi.uz);
    shakl.append("nomiRu", v.nomi.ru);
    shakl.append("nomiEn", v.nomi.en);
    shakl.append("kategoriyaId", v.kategoriyaId);
    shakl.append("kaloriya", v.kaloriya);
    shakl.append("oqsil", v.oqsil);
    shakl.append("yog", v.yog);
    shakl.append("uglevod", v.uglevod);
    shakl.append("porsiya", v.porsiya);
    shakl.append("vaqtDaqiqa", v.vaqtDaqiqa);
    shakl.append("murakkablik", v.murakkablik);
    for (const t of TILLAR) {
      const qoshimcha = t[0].toUpperCase() + t.slice(1);
      shakl.append(`masalliqlar${qoshimcha}`, v.masalliqlar[t]);
      shakl.append(`qadamlar${qoshimcha}`, v.qadamlar[t]);
    }
    shakl.append("amal", amal);
    if (rasm) shakl.append("rasm", rasm, "retsept.jpg");

    try {
      const javob = await apiSorov(retsept ? `/api/admin/retseptlar/${retsept.id}` : "/api/admin/retseptlar", {
        method: retsept ? "PATCH" : "POST",
        body: shakl,
      });
      if (!javob.ok) {
        setXato(await xatoMatni(javob));
        return;
      }
      router.push("/admin/retseptlar");
      router.refresh();
    } catch {
      setXato("Saqlab bo'lmadi. Internetni tekshirib, qayta urinib ko'ring");
    } finally {
      setYuborilayotgan(null);
    }
  }

  const rasmManzili = korinish ?? retsept?.rasm ?? null;
  const qadamlarSoni = qatorlargaBol(v.qadamlar[til]).length;

  return (
    <AdminSahifa
      sarlavha={retsept ? retsept.nomi : "Yangi retsept"}
      izoh={retsept ? `${HOLAT_NOMLARI[retsept.holat]} · id: ${retsept.id}` : undefined}
      amallar={
        <span className="flex flex-wrap justify-end gap-2">
          <Link href="/admin/retseptlar" className={sinf("uchinchi", true)}>
            Bekor qilish
          </Link>
          {chopEtilgan ? (
            <Tugma
              korinish="siyoh"
              kichik
              disabled={tegildi && !toliq}
              yuklanmoqda={yuborilayotgan === "saqlash"}
              onClick={() => saqla("saqlash")}
            >
              Saqlash
            </Tugma>
          ) : (
            <>
              <Tugma
                korinish="ikkilamchi"
                kichik
                disabled={(tegildi && !yaroqli) || yuborilayotgan === "chop_etish"}
                yuklanmoqda={yuborilayotgan === "saqlash"}
                onClick={() => saqla("saqlash")}
              >
                Saqlash (qoralama)
              </Tugma>
              <Tugma
                korinish="siyoh"
                kichik
                disabled={!toliq || yuborilayotgan === "saqlash"}
                yuklanmoqda={yuborilayotgan === "chop_etish"}
                onClick={() => saqla("chop_etish")}
              >
                Chop etish
              </Tugma>
            </>
          )}
        </span>
      }
    >
      <div role="tablist" aria-label="Kontent tili" className="flex max-w-[360px] rounded-chip border border-chegara bg-karta p-1">
        {TILLAR.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={til === t}
            onClick={() => setTil(t)}
            className={`min-h-10 flex-1 rounded-chip px-3 text-asosiy font-medium transition-colors ${
              til === t ? "bg-siyoh text-on-siyoh" : "text-siyoh"
            }`}
          >
            {TIL_NOMLARI[t]}
          </button>
        ))}
      </div>

      <Karta sarlavha="Sarlavha" yorliq={<Yorliq ton="neytral">{"FREE ga ko'rinadi"}</Yorliq>}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
          <Maydon
            nomi={`Nomi — ${TIL_QOSHIMCHASI[til]}`}
            qiymat={v.nomi[til]}
            onChange={setTilda("nomi")}
            majburiy={til === "uz"}
            maxLength={NOM_CHEGARASI}
            xato={til === "uz" && tegildi ? xatolar.nomi : undefined}
          />
          <KategoriyaTanlovi
            kategoriyalar={kategoriyalar}
            qiymat={v.kategoriyaId}
            onTanla={set("kategoriyaId")}
            onRoyxat={setKategoriyalar}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Maydon nomi="Kaloriya" qiymat={v.kaloriya} onChange={set("kaloriya")} birlik="kkal" raqam xato={tegildi ? xatolar.kaloriya : undefined} />
          <Maydon nomi="Oqsil" qiymat={v.oqsil} onChange={set("oqsil")} birlik="g" raqam xato={tegildi ? xatolar.oqsil : undefined} />
          <Maydon nomi="Yog'" qiymat={v.yog} onChange={set("yog")} birlik="g" raqam xato={tegildi ? xatolar.yog : undefined} />
          <Maydon nomi="Uglevod" qiymat={v.uglevod} onChange={set("uglevod")} birlik="g" raqam xato={tegildi ? xatolar.uglevod : undefined} />
          <Maydon nomi="Porsiya" qiymat={v.porsiya} onChange={set("porsiya")} maxLength={PORSIYA_CHEGARASI} />
          <Maydon nomi="Tayyorlash vaqti" qiymat={v.vaqtDaqiqa} onChange={set("vaqtDaqiqa")} birlik="daq" raqam xato={tegildi ? xatolar.vaqt : undefined} />
        </div>
        <OynaChiplar
          nomi="Murakkablik"
          qiymat={v.murakkablik}
          variantlar={MURAKKABLIK_VARIANTLARI}
          onTanla={(m) => setV((s) => ({ ...s, murakkablik: m }))}
        />
        <p className="text-izoh text-matn-2">
          Sarlavha, rasm, kaloriya va tayyorlash vaqti FREE foydalanuvchiga ko&apos;rinadi; kaloriya va makrolar bitta porsiya uchun.
        </p>
      </Karta>

      <Karta sarlavha="Masalliqlar va qadamlar" yorliq={<Yorliq ton="ai">PRO ostida</Yorliq>}>
        <KopQatorli
          nomi={`Masalliqlar — ${TIL_QOSHIMCHASI[til]}`}
          qiymat={v.masalliqlar[til]}
          onChange={setTilda("masalliqlar")}
          qatorlar={5}
          joyMatni="Har qatorda bitta masalliq"
          korsatkich={sanoq(v.masalliqlar[til], "masalliq")}
        />
        <KopQatorli
          nomi={`Tayyorlash qadamlari — ${TIL_QOSHIMCHASI[til]}`}
          qiymat={v.qadamlar[til]}
          onChange={setTilda("qadamlar")}
          qatorlar={7}
          joyMatni="Har qatorda bitta qadam — bo'sh qoldirsangiz ilovada bu bo'lim ko'rinmaydi"
          korsatkich={
            qadamlarSoni > 0
              ? `${qadamlarSoni} ta qadam`
              : "Qadam kiritilmagan — ilovada «Tayyorlash» bo'limi umuman chiqmaydi"
          }
        />
      </Karta>

      <Karta sarlavha="Rasm" yorliq={<Yorliq ton="neytral">{"FREE ga ko'rinadi"}</Yorliq>}>
        <input
          ref={faylMaydoni}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            void rasmTanlandi(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => faylMaydoni.current?.click()}
          className="relative flex h-40 w-full items-center justify-center gap-2 overflow-hidden rounded-karta border border-dashed border-chegara text-izoh text-matn-3 sm:max-w-[420px]"
        >
          {rasmManzili ? (
            <Image src={rasmManzili} alt="" fill unoptimized className="object-cover" />
          ) : (
            <>
              <Belgi nomi="upload" olcham={16} />
              Rasm yuklash
            </>
          )}
        </button>
        <p className="text-izoh text-matn-2">
          {rasmManzili ? "Boshqa rasm tanlash uchun ustiga bosing." : "JPEG, PNG yoki WebP, 4 MB gacha."}
        </p>
        {rasmXatosi && <p className="text-izoh text-xato">{rasmXatosi}</p>}
      </Karta>

      {!chopEtilgan && kamchiliklar.length > 0 && (
        <p className="text-izoh text-matn-2">{kamchilikXabari(kamchiliklar)}</p>
      )}
      {xato && (
        <p role="alert" className="text-asosiy text-xato">
          {xato}
        </p>
      )}
    </AdminSahifa>
  );
}
