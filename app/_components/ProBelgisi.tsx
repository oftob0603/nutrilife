import Link from "next/link";

const KORINISH =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-(image:--pro-gradient) px-2 py-[3px] text-[11px] font-medium leading-none text-(--pro-fg)";

/**
 * PRO belgisi — prototipdagi `Badge tone="pro"`: PRO gradiyenti (DESIGN.md, "PRO ranglari").
 * `href` berilsa bosiladi — FREE va muddati tugagan hisobda tariflarga ikkinchi kirish yo'li.
 */
export function ProBelgisi({ href }: { href?: string }) {
  if (href) {
    return (
      <Link href={href} className={KORINISH}>
        PRO
      </Link>
    );
  }
  return <span className={KORINISH}>PRO</span>;
}
