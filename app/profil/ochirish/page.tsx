import { redirect } from "next/navigation";
import { HisobniOchirish } from "@/app/_components/profil/HisobniOchirish";
import { profilniYukla } from "../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Hisobni o'chirish — NutriLifer" };

/** F5 — hisobni o'chirish. Faol PRO bo'lsa ogohlantirish matni boshqacha, shuning uchun profil kerak. */
export default async function OchirishSahifasi() {
  const profil = await profilniYukla();
  if (profil === "sessiyasiz") return null;
  if (!profil) redirect("/profil");

  return <HisobniOchirish faolPro={profil.obuna.holat === "pro"} />;
}
