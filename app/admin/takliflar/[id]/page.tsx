import Link from "next/link";
import { sinf } from "@/app/_components/Tugma";
import { kunOyVaqt, sanaMatni } from "@/lib/services/admin-hisob";
import {
  HOLAT_MATNLARI,
  KUTAYOTGAN_HOLATLAR,
  makroMatni,
  taklifIzohi,
  zichlik,
} from "@/lib/services/taom-taklif-hisob";
import { AdminSahifa } from "../../_components/AdminSahifa";
import { TaklifQarori } from "../../_components/TaklifQarori";
import { TaklifRasmi } from "../../_components/TaklifRasmi";
import { XatoHolati } from "../../_components/XatoHolati";
import { Yorliq } from "../../_components/Yorliq";
import { taklifniYukla } from "../../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Taklifni ko'rib chiqish — Admin" };

/** A5 ustuni (prototip `Col`): sarlavha, taom nomi, zichlik qatori; `siyoh` — foydalanuvchi tuzatishi ajratiladi. */
function Ustun({
  sarlavha,
  siyoh = false,
  children,
}: {
  sarlavha: string;
  siyoh?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`flex flex-col gap-3 rounded-karta border bg-karta p-4 ${siyoh ? "border-siyoh" : "border-karta-chegara"}`}
    >
      <span className="text-izoh text-matn-2">{sarlavha}</span>
      {children}
    </section>
  );
}

/**
 * A5 — taklifni ko'rib chiqish (admin-tz.md): chapda foydalanuvchi rasmi (panelda rasm faqat shu
 * yerda, §4), o'ngda uch ustun — AI natijasi · Foydalanuvchi tuzatishi · Bazadagi taom; pastda
 * qaror tasmasi. Qaror berilgan taklifda tasma o'rniga natija ko'rinadi.
 */
export default async function TaklifSahifasi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const natija = await taklifniYukla(id);
  const qaytish = (
    <Link href="/admin/takliflar" className={sinf("uchinchi", true)}>
      Navbatga qaytish
    </Link>
  );

  if ("holat" in natija) {
    return (
      <AdminSahifa sarlavha="Taklifni ko'rib chiqish" amallar={qaytish}>
        {natija.holat === "topilmadi" ? (
          <p className="text-asosiy text-matn-2">{"Bunday taklif yo'q."}</p>
        ) : (
          <XatoHolati xabar="Taklifni yuklab bo'lmadi" />
        )}
      </AdminSahifa>
    );
  }

  const { karta } = natija;
  const z = zichlik(karta.tuzatish);
  const kutilmoqda = KUTAYOTGAN_HOLATLAR.includes(karta.holat);
  const kim = karta.kim ? (karta.kim.ism ?? "Ismsiz") : "O'chirilgan foydalanuvchi";

  return (
    <AdminSahifa
      sarlavha="Taklifni ko'rib chiqish"
      izoh={taklifIzohi(karta.id, karta.yaratilgan, kim)}
      amallar={qaytish}
    >
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[320px_1fr]">
        <TaklifRasmi manzil={karta.rasm} katta />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
          <Ustun sarlavha="AI natijasi">
            <span className="text-karta-sarlavha">{karta.ai.taomNomi}</span>
            <span className="text-asosiy text-matn-2">
              {Math.round(karta.ai.kaloriya100)} kkal / 100 g · porsiya {karta.ai.porsiyaGramm} g
            </span>
            <span className="text-izoh text-matn-2">{makroMatni(karta.ai)}</span>
            <span>
              <Yorliq ton="ai">AI</Yorliq>
            </span>
          </Ustun>
          <Ustun sarlavha="Foydalanuvchi tuzatishi" siyoh>
            <span className="text-karta-sarlavha">{karta.tuzatish.taomNomi}</span>
            <span className="text-asosiy text-matn-2">
              {Math.round(z.kaloriya100)} kkal / 100 g · porsiya {karta.tuzatish.porsiyaGramm} g
            </span>
            <span className="text-izoh text-matn-2">{makroMatni(z)}</span>
            <span className="text-izoh text-matn-2">
              {kim}
              {karta.kim && (
                <>
                  {" · "}
                  <Link href={`/admin/foydalanuvchilar/${karta.kim.id}`} className="underline underline-offset-2">
                    kartasi
                  </Link>
                </>
              )}
            </span>
          </Ustun>
          <Ustun sarlavha="Bazadagi taom">
            {karta.oxshash ? (
              <>
                <span className="text-karta-sarlavha">{karta.oxshash.nomi}</span>
                <span className="text-asosiy text-matn-2">
                  {Math.round(karta.oxshash.kaloriya)} kkal / {karta.oxshash.olchovMiqdori}{" "}
                  {karta.oxshash.olchovBirligi}
                </span>
                <span className="text-izoh text-matn-2">
                  {karta.oxshash.nomiRu || "—"} · {karta.oxshash.nomiEn || "—"}
                </span>
                <span className="text-izoh text-matn-2">bazada mavjud</span>
              </>
            ) : karta.natija.taom ? (
              <>
                <span className="text-karta-sarlavha">{karta.natija.taom.nomi}</span>
                <span className="text-izoh text-matn-2">{`«${karta.natija.taom.id}» — qaror natijasi`}</span>
              </>
            ) : (
              <span className="text-asosiy text-matn-3">{"O'xshashi topilmadi"}</span>
            )}
          </Ustun>
        </div>
      </div>

      {kutilmoqda ? (
        <TaklifQarori karta={karta} />
      ) : (
        <section className="flex flex-col gap-2 rounded-karta border border-karta-chegara bg-karta p-4">
          <span className="flex items-center gap-2">
            <Yorliq ton={karta.holat === "tasdiqlandi" ? "ai" : "xato"}>{HOLAT_MATNLARI[karta.holat]}</Yorliq>
            <span className="text-izoh text-matn-2">
              {karta.korilgan ? kunOyVaqt(karta.korilgan) : sanaMatni(karta.yaratilgan)}
              {karta.natija.admin ? ` · ${karta.natija.admin}` : ""}
            </span>
          </span>
          <p className="text-asosiy">
            {karta.holat === "rad_etildi"
              ? `Sabab: ${karta.natija.radSababi ?? "—"}`
              : karta.natija.taom
                ? `Bazadagi taom: ${karta.natija.taom.nomi}`
                : "Tasdiqlangan"}
          </p>
        </section>
      )}
    </AdminSahifa>
  );
}
