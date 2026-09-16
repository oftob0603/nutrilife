export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-karta p-6 text-center">
        <span className="inline-block rounded-full bg-aksent px-2.5 py-0.5 text-[11px] font-medium text-aksent-matn">
          Skelet
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">
          Loyiha tayyor
        </h1>
        <p className="mt-2 text-[15px] leading-normal text-matn-2">
          Next.js, TypeScript, Tailwind va Prisma o&apos;rnatildi. Mahsulot kodi
          Sprint 1&apos;dan boshlanadi.
        </p>
      </div>
    </main>
  );
}
