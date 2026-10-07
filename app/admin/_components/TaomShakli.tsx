"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sinf, Tugma } from "@/app/_components/Tugma";
import { apiSorov } from "@/lib/services/api-klient";
import { rasmniSiq } from "@/lib/services/rasm-yuklash";
import type { Kategoriya, TaomKartasi } from "@/lib/services/taom-admin";
import {
  BIRLIKLAR,
  MAKRO_FARQ_CHEGARASI,
  makroFarqi,
  makroKaloriyasi,
  NOM_CHEGARASI,
  PORSIYA_SONI_CHEGARASI,
  porsiyalarMatni,
  porsiyalarniOqi,
  sonMatni,
  type Birlik,
} from "@/lib/services/taom-admin-hisob";
import { AdminOyna, MAYDON_SINFI, OynaChiplar, OynaYorligi } from "./AdminOyna";
import { AdminSahifa } from "./AdminSahifa";
import { Belgi } from "./Belgi";

type Qiymatlar = {
  nomi: string;
  nomiRu: string;
  nomiEn: string;
  olchovMiqdori: string;
  olchovBirligi: Birlik;
  kaloriya: string;
  oqsil: string;
  yog: string;
  uglevod: string;
  porsiyalar: string;
  kategoriyaId: string;
};

const BOSH: Qiymatlar = {
  nomi: "",
  nomiRu: "",
  nomiEn: "",
  olchovMiqdori: "100",
  olchovBirligi: "g",
  kaloriya: "",
  oqsil: "",
  yog: "",
  uglevod: "",
  porsiyalar: "",
  kategoriyaId: "",
};

const BIRLIK_VARIANTLARI = BIRLIKLAR.map((b) => ({ id: b, nomi: b }));

function boshlangich(taom: TaomKartasi | null): Qiymatlar {
  if (!taom) return BOSH;
  const birlik = BIRLIKLAR.find((b) => b === taom.olchovBirligi) ?? "g";
  return {
    nomi: taom.nomi,
    nomiRu: taom.nomiRu,
    nomiEn: taom.nomiEn,
    olchovMiqdori: String(taom.olchovMiqdori),
    olchovBirligi: birlik,
    kaloriya: sonMatni(taom.kaloriya),
    oqsil: sonMatni(taom.oqsil),
    yog: sonMatni(taom.yog),
    uglevod: sonMatni(taom.uglevod),
    porsiyalar: porsiyalarMatni(taom.porsiyalar),
    kategoriyaId: taom.kategoriyaId ?? "",
  };
}

/** "12,5" ham o'qiladi; bo'sh yoki son emas — NaN. */
function son(matn: string): number {
  const toza = matn.trim().replace(",", ".");
  return toza === "" ? NaN : Number(toza);
}

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

function Karta({ sarlavha, children }: { sarlavha: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-karta border border-karta-chegara bg-karta p-4">
      <h2 className="text-karta-sarlavha">{sarlavha}</h2>
      {children}
    </section>
  );
}

/** Matn/son maydoni (prototip `Input`): yorliq, ixtiyoriy birlik, xato matni ostida. */
function Maydon({
  nomi,
  qiymat,
  onChange,
  birlik,
  raqam = false,
  majburiy = false,
  xato,
}: {
  nomi: string;
  qiymat: string;
  onChange: (qiymat: string) => void;
  birlik?: string;
  raqam?: boolean;
  majburiy?: boolean;
  xato?: string;
}) {
  return (
    <OynaYorligi nomi={nomi} majburiy={majburiy}>
      <span className="relative block">
        <input
          type="text"
          inputMode={raqam ? "decimal" : undefined}
          value={qiymat}
          maxLength={raqam ? 12 : NOM_CHEGARASI}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={xato ? true : undefined}
          className={`${MAYDON_SINFI}${raqam ? " tabular-nums" : ""}${birlik ? " pr-12" : ""}${xato ? " border-xato" : ""}`}
        />
        {birlik && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-izoh text-matn-3">
            {birlik}
          </span>
        )}
      </span>
      {xato && <span className="text-izoh text-xato">{xato}</span>}
    </OynaYorligi>
  );
}

/**
 * A7 — taom muharriri (admin-tz.md, prototip screens-content.jsx): nomi uch tilda (uchalasi
 * majburiy), S1 modelidagi o'lchov (miqdor + birlik) va shu o'lchov uchun kaloriya/makrolar,
 * porsiya variantlari, kategoriya ("Yangi qo'shish" oynasi bilan) va rasm. Makrolardan hisoblangan
 * kaloriya kiritilganidan 20 % dan ko'p farq qilsa ogohlantirish — saqlashni to'smaydi.
 * `taom` null — yangi taom (POST), aks holda tahrir (PATCH, id o'zgarmaydi).
 */
export function TaomShakli({
  taom,
  kategoriyalar: boshlangichKategoriyalar,
}: {
  taom: TaomKartasi | null;
  kategoriyalar: Kategoriya[];
}) {
  const router = useRouter();
  const [v, setV] = useState<Qiymatlar>(() => boshlangich(taom));
  const [kategoriyalar, setKategoriyalar] = useState(boshlangichKategoriyalar);
  const [tegildi, setTegildi] = useState(false);
  const [xato, setXato] = useState<string | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  // Rasm: tanlangan fayl (siqilgan) va uning ko'rinishi; tanlanmagan bo'lsa bazadagi rasm.
  const [rasm, setRasm] = useState<Blob | null>(null);
  const [korinish, setKorinish] = useState<string | null>(null);
  const [rasmXatosi, setRasmXatosi] = useState<string | null>(null);
  const faylMaydoni = useRef<HTMLInputElement>(null);
  useEffect(() => () => void (korinish && URL.revokeObjectURL(korinish)), [korinish]);

  // "Yangi kategoriya" oynasi
  const [katOyna, setKatOyna] = useState(false);
  const [katNomi, setKatNomi] = useState("");
  const [katXato, setKatXato] = useState<string | null>(null);
  const [katYuborilmoqda, setKatYuborilmoqda] = useState(false);

  const set = (kalit: keyof Qiymatlar) => (qiymat: string) => setV((s) => ({ ...s, [kalit]: qiymat }));

  const nomXatosi = (nom: string) => (tegildi && !nom.trim() ? "Majburiy" : undefined);
  const miqdor = son(v.olchovMiqdori);
  const kaloriya = son(v.kaloriya);
  const oqsil = son(v.oqsil);
  const yog = son(v.yog);
  const uglevod = son(v.uglevod);
  const porsiyalar = porsiyalarniOqi(v.porsiyalar);

  const xatolar = {
    miqdor: !Number.isInteger(miqdor) || miqdor <= 0 ? "Butun musbat son" : undefined,
    kaloriya: !(kaloriya >= 0) ? "Son kiriting" : undefined,
    oqsil: !(oqsil >= 0) ? "Son kiriting" : undefined,
    yog: !(yog >= 0) ? "Son kiriting" : undefined,
    uglevod: !(uglevod >= 0) ? "Son kiriting" : undefined,
    porsiyalar: porsiyalar ? undefined : `1–${PORSIYA_SONI_CHEGARASI} ta butun son, vergul bilan`,
  };
  const nomlarToliq = Boolean(v.nomi.trim() && v.nomiRu.trim() && v.nomiEn.trim());
  const yaroqli = nomlarToliq && Object.values(xatolar).every((x) => x === undefined);

  const hisob = makroKaloriyasi(oqsil || 0, yog || 0, uglevod || 0);
  const farq = makroFarqi(kaloriya, hisob);

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

  async function saqla() {
    setTegildi(true);
    if (!yaroqli || yuborilmoqda) return;
    setXato(null);
    setYuborilmoqda(true);

    const shakl = new FormData();
    for (const [kalit, qiymat] of Object.entries(v)) shakl.append(kalit, qiymat);
    if (rasm) shakl.append("rasm", rasm, "taom.jpg");

    try {
      const javob = await apiSorov(taom ? `/api/admin/taomlar/${taom.id}` : "/api/admin/taomlar", {
        method: taom ? "PATCH" : "POST",
        body: shakl,
      });
      if (!javob.ok) {
        setXato(await xatoMatni(javob));
        return;
      }
      router.push("/admin/taomlar");
      router.refresh();
    } catch {
      setXato("Saqlab bo'lmadi. Internetni tekshirib, qayta urinib ko'ring");
    } finally {
      setYuborilmoqda(false);
    }
  }

  async function kategoriyaQosh() {
    const nomi = katNomi.trim();
    if (!nomi || katYuborilmoqda) return;
    setKatXato(null);
    setKatYuborilmoqda(true);
    try {
      const javob = await apiSorov("/api/admin/kategoriyalar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nomi }),
      });
      if (!javob.ok) {
        setKatXato(await xatoMatni(javob));
        return;
      }
      const { kategoriya } = (await javob.json()) as { kategoriya: Kategoriya };
      setKategoriyalar((k) => [...k, kategoriya].sort((a, b) => a.nomi.localeCompare(b.nomi, "uz")));
      setV((s) => ({ ...s, kategoriyaId: kategoriya.id }));
      setKatOyna(false);
    } catch {
      setKatXato("Qo'shib bo'lmadi. Qayta urinib ko'ring");
    } finally {
      setKatYuborilmoqda(false);
    }
  }

  const rasmManzili = korinish ?? taom?.rasm ?? null;

  return (
    <AdminSahifa
      sarlavha={taom ? taom.nomi : "Yangi taom"}
      izoh={taom ? `id: ${taom.id}` : undefined}
      amallar={
        <span className="flex gap-2">
          <Link href="/admin/taomlar" className={sinf("uchinchi", true)}>
            Bekor qilish
          </Link>
          <Tugma korinish="siyoh" kichik disabled={tegildi && !yaroqli} yuklanmoqda={yuborilmoqda} onClick={saqla}>
            Saqlash
          </Tugma>
        </span>
      }
    >
      <Karta sarlavha="Nomi — uchalasi ham majburiy">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Maydon nomi="O'zbekcha" qiymat={v.nomi} onChange={set("nomi")} majburiy xato={nomXatosi(v.nomi)} />
          <Maydon nomi="Ruscha" qiymat={v.nomiRu} onChange={set("nomiRu")} majburiy xato={nomXatosi(v.nomiRu)} />
          <Maydon nomi="Inglizcha" qiymat={v.nomiEn} onChange={set("nomiEn")} majburiy xato={nomXatosi(v.nomiEn)} />
        </div>
      </Karta>

      <Karta sarlavha="Qiymatlar">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
          <Maydon
            nomi="O'lchov miqdori"
            qiymat={v.olchovMiqdori}
            onChange={set("olchovMiqdori")}
            raqam
            xato={tegildi ? xatolar.miqdor : undefined}
          />
          <OynaChiplar
            nomi="O'lchov birligi"
            qiymat={v.olchovBirligi}
            variantlar={BIRLIK_VARIANTLARI}
            onTanla={(b) => setV((s) => ({ ...s, olchovBirligi: b }))}
          />
        </div>
        <p className="text-izoh text-matn-2">
          {`Kaloriya va makrolar shu o'lchov uchun: ${v.olchovMiqdori || "…"} ${v.olchovBirligi}`}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Maydon nomi="Kaloriya" qiymat={v.kaloriya} onChange={set("kaloriya")} birlik="kkal" raqam xato={tegildi ? xatolar.kaloriya : undefined} />
          <Maydon nomi="Oqsil" qiymat={v.oqsil} onChange={set("oqsil")} birlik="g" raqam xato={tegildi ? xatolar.oqsil : undefined} />
          <Maydon nomi="Yog'" qiymat={v.yog} onChange={set("yog")} birlik="g" raqam xato={tegildi ? xatolar.yog : undefined} />
          <Maydon nomi="Uglevod" qiymat={v.uglevod} onChange={set("uglevod")} birlik="g" raqam xato={tegildi ? xatolar.uglevod : undefined} />
        </div>
        {farq > MAKRO_FARQ_CHEGARASI && (
          // Prototip `Note tone="warn"`: xato rangida chegara va belgi, matn siyoh.
          <div role="status" className="flex gap-3 rounded-karta border border-xato p-3">
            <span className="text-xato">
              <Belgi nomi="triangle-alert" olcham={20} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-asosiy font-medium text-siyoh">Makrolar kaloriyaga mos kelmayapti</span>
              <span className="text-izoh text-siyoh">
                {`4×oqsil + 9×yog' + 4×uglevod = ${Math.round(hisob)} kkal, kiritilgani ${Math.round(kaloriya)} kkal — farq ${Math.round(farq * 100)}%. Tekshirib ko'ring.`}
              </span>
            </span>
          </div>
        )}
        <Maydon
          nomi={`Porsiya variantlari (${v.olchovBirligi}, vergul bilan)`}
          qiymat={v.porsiyalar}
          onChange={set("porsiyalar")}
          raqam
          xato={tegildi ? xatolar.porsiyalar : undefined}
        />
        <p className="text-izoh text-matn-2">{"E5/E7 da tanlanadigan miqdorlar, masalan 150, 250, 350. O'rtadagisi birlamchi."}</p>
      </Karta>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Karta sarlavha="Kategoriya">
          <OynaYorligi nomi="Kategoriya">
            <select value={v.kategoriyaId} onChange={(e) => set("kategoriyaId")(e.target.value)} className={MAYDON_SINFI}>
              <option value="">Tanlanmagan</option>
              {kategoriyalar.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nomi}
                </option>
              ))}
            </select>
          </OynaYorligi>
          <button
            type="button"
            onClick={() => {
              setKatNomi("");
              setKatXato(null);
              setKatOyna(true);
            }}
            className="inline-flex min-h-11 items-center gap-2 self-start text-asosiy font-medium text-siyoh"
          >
            <Belgi nomi="plus" olcham={16} />
            {"Yangi qo'shish"}
          </button>
        </Karta>

        <Karta sarlavha="Rasm">
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
            className="relative flex h-32 w-full items-center justify-center gap-2 overflow-hidden rounded-karta border border-dashed border-chegara text-izoh text-matn-3"
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
      </div>

      {xato && (
        <p role="alert" className="text-asosiy text-xato">
          {xato}
        </p>
      )}

      {katOyna && (
        <AdminOyna
          sarlavha="Yangi kategoriya"
          izoh="Kategoriya barcha taom va retsept shakllarida darhol paydo bo'ladi."
          tasdiqMatni="Qo'shish"
          tasdiqOchiq={katNomi.trim().length >= 2}
          yuborilmoqda={katYuborilmoqda}
          onTasdiq={kategoriyaQosh}
          onYop={() => setKatOyna(false)}
        >
          <OynaYorligi nomi="Nomi" majburiy>
            <input
              type="text"
              value={katNomi}
              maxLength={40}
              autoFocus
              onChange={(e) => {
                setKatNomi(e.target.value);
                setKatXato(null);
              }}
              className={MAYDON_SINFI}
            />
          </OynaYorligi>
          {katXato && <p className="text-izoh text-xato">{katXato}</p>}
        </AdminOyna>
      )}
    </AdminSahifa>
  );
}
