import Link from "next/link";
import { amalNomi, kunOyVaqt, son } from "@/lib/services/admin-hisob";
import { AdminJadval, type Qator } from "./_components/AdminJadval";
import { AdminSahifa } from "./_components/AdminSahifa";
import { StatKarta } from "./_components/StatKarta";
import { boshqaruvniYukla } from "./yukla";

/** "5-oktabr, dushanba" — prototipdagi sarlavha izohi, Toshkent kuni. */
function bugunMatni(): string {
  const bolaklar = new Intl.DateTimeFormat("uz-Latn-UZ", {
    day: "numeric",
    month: "long",
    weekday: "long",
    timeZone: "Asia/Tashkent",
  }).formatToParts(new Date());
  const ol = (tur: Intl.DateTimeFormatPartTypes) => bolaklar.find((b) => b.type === tur)?.value ?? "";
  return `${ol("day")}-${ol("month")}, ${ol("weekday")}`;
}

const JURNAL_USTUNLARI = [
  { kalit: "sana", nomi: "Sana", eni: "160px", xira: true },
  { kalit: "kim", nomi: "Kim", eni: "100px", xira: true },
  { kalit: "amal", nomi: "Amal", eni: "minmax(0,2fr)" },
  { kalit: "sabab", nomi: "Sabab", eni: "160px", xira: true },
];

/**
 * A1 — boshqaruv paneli. To'rt raqam, takliflar navbati, "7 kun ichida tugaydigan obunalar" va
 * admin amallari jurnali jonli; so'rovlar navbati o'z taski (S6 9-task) bilan ulanadi — joyi
 * prototipdagidek turadi.
 */
export default async function BoshqaruvSahifasi() {
  const sahifa = await boshqaruvniYukla();
  const boshqaruv = sahifa?.boshqaruv ?? null;

  // Prototip: "PRO berildi — Kamola Tosheva"; ism bosilsa foydalanuvchi kartasi ochiladi.
  const amallar: Qator[] = (sahifa?.amallar ?? []).map((a) => ({
    id: a.id,
    sana: kunOyVaqt(a.vaqt),
    kim: a.admin ?? "admin",
    amal: (
      <>
        {amalNomi(a.tur)}
        {a.foydalanuvchi && (
          <>
            {" — "}
            <Link href={`/admin/foydalanuvchilar/${a.foydalanuvchi.id}`} className="underline underline-offset-2">
              {a.foydalanuvchi.ism ?? "Ismsiz"}
            </Link>
          </>
        )}
        <span className="text-matn-2">{` · ${a.tafsilot}`}</span>
      </>
    ),
    sabab: a.sabab,
  }));

  return (
    <AdminSahifa sarlavha="Boshqaruv paneli" izoh={bugunMatni()}>
      {!boshqaruv && (
        <p role="alert" className="text-izoh text-xato">
          {"Statistikani yuklab bo'lmadi. Sahifani yangilab ko'ring"}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatKarta
          nomi="Bugungi yangi foydalanuvchilar"
          belgi="user-plus"
          qiymat={boshqaruv ? son(boshqaruv.bugungiYangi) : null}
        />
        <StatKarta
          nomi="Kunlik faol"
          belgi="activity"
          qiymat={boshqaruv ? son(boshqaruv.kunlikFaol) : null}
        />
        <StatKarta
          nomi="Bugungi skanlar"
          belgi="scan-line"
          qiymat={boshqaruv ? son(boshqaruv.bugungiSkanlar) : null}
        />
        <StatKarta
          nomi="Faol PRO obunalar"
          belgi="crown"
          qiymat={boshqaruv ? son(boshqaruv.faolPro) : null}
        />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-karta-sarlavha">Ish navbatlari</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatKarta
            nomi="Tasdiq kutayotgan takliflar"
            belgi="inbox"
            qiymat={boshqaruv ? son(boshqaruv.kutayotganTakliflar) : null}
            href="/admin/takliflar"
          />
          <StatKarta nomi="Ko'rilmagan so'rovlar" belgi="message-square-warning" qiymat="—" izoh="Navbat hali ulanmagan" />
          <StatKarta
            nomi="7 kun ichida tugaydigan obunalar"
            belgi="clock"
            qiymat={boshqaruv ? son(boshqaruv.tugayotganObunalar) : null}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-karta-sarlavha">Oxirgi amallar</h2>
        <AdminJadval ustunlar={JURNAL_USTUNLARI} qatorlar={amallar} bosh="Hali amal yo'q" />
        <p className="text-izoh text-matn-2">{"Jurnal tahrirlanmaydi va o'chirilmaydi"}</p>
      </section>
    </AdminSahifa>
  );
}
