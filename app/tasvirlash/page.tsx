import { Tasvirlash } from "@/app/_components/Tasvirlash";
import { MATN_CHEGARASI } from "@/lib/services/skan-hisob";

export const metadata = { title: "Matn bilan tasvirlash — NutriLifer" };

/** E4'dan keladi: `?matn=` — qidiruvda topilmagan so'z, maydonga oldindan yoziladi. */
export default async function TasvirlashSahifasi({
  searchParams,
}: PageProps<"/tasvirlash">) {
  const { matn } = await searchParams;
  const boshlangich = typeof matn === "string" ? matn.slice(0, MATN_CHEGARASI) : "";

  return <Tasvirlash boshlangich={boshlangich} />;
}
