import Image from "next/image";

/**
 * Taom rasmi: yozuv qatorida kichik kvadrat (48 px), retsept taklifida 56 px, katta ko'rinishda 4:3.
 * Rasm yo'q bo'lsa prototipdagidek bo'sh o'rin turadi (DESIGN.md, 6-bo'lim).
 */
export function TaomRasmi({
  rasm,
  olcham = "kichik",
}: {
  rasm: string | null;
  olcham?: "kichik" | "orta" | "katta";
}) {
  const qolip =
    olcham === "katta"
      ? "relative aspect-[4/3] w-full overflow-hidden rounded-chip bg-chegara"
      : `relative ${olcham === "orta" ? "size-14" : "size-12"} shrink-0 overflow-hidden rounded-chip bg-chegara`;

  return (
    <div className={qolip}>
      {rasm && (
        <Image
          src={rasm}
          alt=""
          fill
          sizes={olcham === "katta" ? "(min-width: 448px) 416px, 100vw" : olcham === "orta" ? "56px" : "48px"}
          // Yuklangan rasm imzoli ombor havolasiga yo'naltiriladi — optimizator uni o'qiy olmaydi.
          unoptimized={rasm.startsWith("/api/")}
          priority={olcham === "katta"}
          className="object-cover"
        />
      )}
    </div>
  );
}
