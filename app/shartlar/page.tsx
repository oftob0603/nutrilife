import { notFound } from "next/navigation";
import { Hujjat } from "@/app/_components/Hujjat";
import { hujjatMatni, hujjatShuTildami } from "@/lib/hujjatlar";
import { serverTarjimoni, serverTili } from "@/lib/lugat/server";

export const metadata = { title: "Foydalanish shartlari — NutriLifer" };

/** Foydalanish shartlari (S5 10-task). Matn manbai: hujjatlar/shartlar.<til>.md */
export default async function ShartlarSahifasi() {
  const [til, { t }] = await Promise.all([serverTili(), serverTarjimoni()]);
  const matn = hujjatMatni("shartlar", til);
  if (!matn) notFound();

  return (
    <Hujjat
      manzil="/shartlar"
      sarlavha={t("Foydalanish shartlari")}
      matn={matn}
      tarjimasiz={!hujjatShuTildami("shartlar", til)}
    />
  );
}
