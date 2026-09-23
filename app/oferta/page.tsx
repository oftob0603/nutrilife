import { notFound } from "next/navigation";
import { Hujjat } from "@/app/_components/Hujjat";
import { hujjatMatni, hujjatShuTildami } from "@/lib/hujjatlar";
import { serverTarjimoni, serverTili } from "@/lib/lugat/server";

export const metadata = { title: "Ommaviy oferta — NutriLifer" };

/** Ommaviy oferta (S5 10-task). Matn manbai: hujjatlar/oferta.<til>.md */
export default async function OfertaSahifasi() {
  const [til, { t }] = await Promise.all([serverTili(), serverTarjimoni()]);
  const matn = hujjatMatni("oferta", til);
  if (!matn) notFound();

  return (
    <Hujjat
      sarlavha={t("Ommaviy oferta")}
      matn={matn}
      tarjimasiz={!hujjatShuTildami("oferta", til)}
    />
  );
}
