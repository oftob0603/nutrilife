import Image from "next/image";

/**
 * Retsept rasmi (prototip `FoodImage`): rasm yo'q bo'lsa bo'sh chegara rangli joy. `xira` —
 * FREE'ga yopiq retsept: blur va biroz kattalashtirilgan (prototip `locked`).
 */
export function RetseptRasmi({
  rasm,
  balandlik,
  xira = false,
  ustiga,
}: {
  rasm: string | null;
  /** Tailwind balandlik sinfi: karta `h-[104px]`, detal `h-[200px]`. */
  balandlik: string;
  xira?: boolean;
  /** Rasm ustidagi qatlam (qulf, PRO belgisi, yurak). */
  ustiga?: React.ReactNode;
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-chegara ${balandlik}`}>
      {rasm && (
        <Image
          src={rasm}
          alt=""
          fill
          sizes="(min-width: 448px) 416px, 100vw"
          // Yuklangan rasm imzoli ombor havolasiga yo'naltiriladi — optimizator uni o'qiy olmaydi.
          unoptimized={rasm.startsWith("/api/")}
          className={`object-cover ${xira ? "scale-[1.08] blur-[6px]" : ""}`}
        />
      )}
      {ustiga}
    </div>
  );
}
