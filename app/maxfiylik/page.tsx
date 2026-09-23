import { notFound } from "next/navigation";
import { Hujjat } from "@/app/_components/Hujjat";
import { hujjatMatni, hujjatShuTildami } from "@/lib/hujjatlar";
import { serverTarjimoni, serverTili } from "@/lib/lugat/server";

export const metadata = { title: "Maxfiylik siyosati — NutriLifer" };

/** Maxfiylik siyosati (S5 10-task). Matn manbai: hujjatlar/maxfiylik.<til>.md */
export default async function MaxfiylikSahifasi() {
  const [til, { t }] = await Promise.all([serverTili(), serverTarjimoni()]);
  const matn = hujjatMatni("maxfiylik", til);
  if (!matn) notFound();

  return (
    <Hujjat
      manzil="/maxfiylik"
      sarlavha={t("Maxfiylik siyosati")}
      matn={matn}
      tarjimasiz={!hujjatShuTildami("maxfiylik", til)}
    />
  );
}
