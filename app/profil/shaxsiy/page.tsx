import { redirect } from "next/navigation";
import { ShaxsiyMalumot } from "@/app/_components/profil/ShaxsiyMalumot";
import { profilniYukla } from "../yukla";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shaxsiy ma'lumot — NutriLifer" };

/** F3 — shaxsiy ma'lumot. Yuklanmasa Profil sahifasiga qaytadi: xato kartasi o'sha yerda. */
export default async function ShaxsiySahifasi() {
  const profil = await profilniYukla();
  // Sessiyasiz ochilgan havola: sahifa kirish pardasi ostida bo'sh turadi, kirgach
  // `KirishDarvozasi` uni sessiya bilan qayta so'raydi.
  if (profil === "sessiyasiz") return null;
  if (!profil) redirect("/profil");

  return <ShaxsiyMalumot profil={profil} />;
}
