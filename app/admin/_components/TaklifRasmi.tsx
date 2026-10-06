import Image from "next/image";
import { Belgi } from "./Belgi";

/**
 * Taklifdagi foydalanuvchi rasmi (A4 mitti 40 px, A5 to'liq). Rasm yo'q yoki hisob bilan
 * o'chgan bo'lsa — belgi (prototip `image` o'rni). Manzil `/api/admin/rasmlar/[id]` —
 * ombordagi imzoli havolaga yo'naltiradi, shuning uchun optimallashtirilmaydi.
 */
export function TaklifRasmi({ manzil, katta = false }: { manzil: string | null; katta?: boolean }) {
  const olcham = katta ? "aspect-square w-full rounded-karta" : "size-10 shrink-0 rounded-chip";
  return (
    <span
      className={`relative inline-flex ${olcham} items-center justify-center overflow-hidden border border-chegara bg-fon text-matn-3`}
    >
      {manzil ? (
        <Image src={manzil} alt="Foydalanuvchi rasmi" fill unoptimized className="object-cover" />
      ) : (
        <span className="flex flex-col items-center gap-2">
          <Belgi nomi="image" olcham={katta ? 28 : 16} />
          {katta && <span className="text-izoh">{"Rasm yo'q"}</span>}
        </span>
      )}
    </span>
  );
}
