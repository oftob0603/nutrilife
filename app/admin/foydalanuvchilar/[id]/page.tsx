import Link from "next/link";
import { sinf } from "@/app/_components/Tugma";
import {
  faollikMatni,
  kunOyVaqt,
  sanaMatni,
  son,
  tarifMatni,
  telegramIdMatni,
  tilMatni,
  tugashKuni,
} from "@/lib/services/admin-hisob";
import type { ObunaManbai } from "@/lib/services/admin-hisob";
import { bugunSana } from "@/lib/services/yozuv-hisob";
import { AdminJadval } from "../../_components/AdminJadval";
import { AdminSahifa } from "../../_components/AdminSahifa";
import { Maydon } from "../../_components/Maydon";
import { ObunaAmallari } from "../../_components/ObunaAmallari";
import { XatoHolati } from "../../_components/XatoHolati";
import { HolatYorligi, Yorliq } from "../../_components/Yorliq";
import { foydalanuvchiniYukla } from "../../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Foydalanuvchi — Admin" };

const YOZUV_USTUNLARI = [
  { kalit: "sana", nomi: "Sana", eni: "140px", xira: true, raqam: true },
  { kalit: "taom", nomi: "Ovqat yozuvi", eni: "minmax(0,2fr)" },
  { kalit: "kkal", nomi: "kkal", eni: "90px", raqam: true, ong: true },
] as const;

const OBUNA_USTUNLARI = [
  { kalit: "tarif", nomi: "Tarif", eni: "minmax(120px,1fr)" },
  { kalit: "boshlanish", nomi: "Boshlanish", eni: "120px", xira: true, raqam: true },
  { kalit: "tugash", nomi: "Tugash", eni: "120px", xira: true, raqam: true },
  { kalit: "manba", nomi: "Manba", eni: "140px" },
] as const;

function Karta({ sarlavha, children }: { sarlavha: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-karta border border-karta-chegara bg-karta p-4">
      <h2 className="text-karta-sarlavha">{sarlavha}</h2>
      {children}
    </section>
  );
}

/** Obuna kartasidagi "Manba": qo'lda berilgan muddat belgilanadi (daromad statistikasiga kirmaydi). */
function manbaBelgisi(manba: ObunaManbai) {
  return manba === "qolda" ? <Yorliq>{"qo'lda berilgan"}</Yorliq> : "to'lov";
}

/** A3 — bitta foydalanuvchi kartasi (admin-tz.md): profil, obuna, faollik va amallar tasmasi. */
export default async function FoydalanuvchiSahifasi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const natija = await foydalanuvchiniYukla(id);
  const qaytish = (
    <Link href="/admin/foydalanuvchilar" className={sinf("uchinchi", true)}>
      {"Ro'yxatga qaytish"}
    </Link>
  );

  if ("holat" in natija) {
    return (
      <AdminSahifa sarlavha="Foydalanuvchi" amallar={qaytish}>
        {natija.holat === "topilmadi" ? (
          <p className="text-asosiy text-matn-2">{"Bunday foydalanuvchi yo'q yoki hisobi o'chirilgan."}</p>
        ) : (
          <XatoHolati xabar="Kartani yuklab bo'lmadi" />
        )}
      </AdminSahifa>
    );
  }

  const { karta } = natija;
  const bugun = bugunSana();
  const pro = karta.obuna.holat === "pro";

  return (
    <AdminSahifa
      sarlavha={karta.ism ?? "Ismsiz"}
      izoh={`Telegram ID ${telegramIdMatni(karta.telegramId)}${karta.username ? ` · @${karta.username}` : ""}`}
      amallar={qaytish}
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Karta sarlavha="Profil">
          <div className="grid grid-cols-2 gap-3">
            <Maydon nomi="Ism">{karta.ism ?? "—"}</Maydon>
            <Maydon nomi="Telegram ID">{telegramIdMatni(karta.telegramId)}</Maydon>
            <Maydon nomi="Til">{tilMatni(karta.til)}</Maydon>
            <Maydon nomi="Ro'yxatdan o'tgan">{sanaMatni(karta.royxat)}</Maydon>
            <Maydon nomi="Rol">
              <span className="flex items-center gap-1">
                <HolatYorligi holat={karta.holat} />
                {karta.admin && <Yorliq>admin</Yorliq>}
              </span>
            </Maydon>
            {karta.bloklangan && <Maydon nomi="Bloklangan">{sanaMatni(karta.bloklangan)}</Maydon>}
          </div>
        </Karta>

        <Karta sarlavha="Obuna">
          <div className="grid grid-cols-2 gap-3">
            <Maydon nomi="Holat">
              {pro ? "Faol" : karta.obuna.holat === "tugagan" ? "Muddati tugagan" : "Yo'q"}
            </Maydon>
            <Maydon nomi="Tarif">{karta.obuna.holat === "pro" ? tarifMatni(karta.obuna.tarif) : "—"}</Maydon>
            <Maydon nomi="Tugash sanasi">
              {karta.obuna.holat === "free" ? "—" : tugashKuni(karta.obuna.tugash)}
            </Maydon>
            <Maydon nomi="Manba">{karta.obuna.holat === "pro" ? manbaBelgisi(karta.obuna.manba) : "—"}</Maydon>
          </div>
          {karta.obuna.holat === "pro" && karta.obuna.manba === "qolda" && (
            <p className="text-izoh text-matn-2">{"Qo'lda berilgan obuna daromad statistikasiga kirmaydi"}</p>
          )}
          <AdminJadval
            ustunlar={OBUNA_USTUNLARI}
            qatorlar={karta.obunalar.map((o) => ({
              id: o.id,
              tarif: tarifMatni(o.tarif),
              boshlanish: sanaMatni(o.boshlanish),
              tugash: tugashKuni(o.tugash),
              manba: manbaBelgisi(o.manba),
            }))}
            bosh="Obuna tarixi bo'sh"
          />
        </Karta>
      </div>

      <Karta sarlavha="Faollik">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
          <Maydon nomi="Jami skanlar">{son(karta.skanlar)}</Maydon>
          <Maydon nomi="Qolgan limit">
            {`${karta.limit.qoldi} / ${karta.limit.soni}`}
            <span className="text-matn-2">{karta.limit.davr === "kun" ? " bugun" : " umrbod"}</span>
          </Maydon>
          <Maydon nomi="Oxirgi faollik">{faollikMatni(karta.oxirgiFaollik, bugun)}</Maydon>
        </div>
        <AdminJadval
          ustunlar={YOZUV_USTUNLARI}
          qatorlar={karta.yozuvlar.map((y) => ({
            id: y.id,
            sana: kunOyVaqt(y.vaqt),
            taom: `${y.taomNomi}, ${y.porsiya}`,
            kkal: son(Math.round(y.kaloriya)),
          }))}
          bosh="Hali ovqat yozuvi yo'q"
        />
      </Karta>

      <ObunaAmallari
        foydalanuvchiId={karta.id}
        pro={pro}
        tugash={karta.obuna.holat === "free" ? null : tugashKuni(karta.obuna.tugash)}
      />
    </AdminSahifa>
  );
}
