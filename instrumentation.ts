// Server ishga tushganda bir marta chaqiriladi (Next.js instrumentation). Fon vazifalari faqat
// Railway'dagi backend jarayonida ishlaydi — `FON_VAZIFALARI=1` shu yerda beriladi; Vercel'da va
// lokal dev'da o'chiq (lib/services/fon-vazifalari.ts).

const BIRINCHI_KECHIKISH_MS = 60_000;
// Har daqiqa: obuna xabarlari belgilangan soat-daqiqada ketadi (obuna-xabar-hisob.ts).
const ORALIQ_MS = 60_000;

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.FON_VAZIFALARI !== "1") return;

  const { fonVazifalariniIshlat } = await import("./lib/services/fon-vazifalari");
  const aylanish = () => {
    fonVazifalariniIshlat().catch((xato: unknown) => {
      console.error("Fon vazifalari ishlamadi", xato instanceof Error ? xato.message : "");
    });
  };
  setTimeout(aylanish, BIRINCHI_KECHIKISH_MS).unref();
  setInterval(aylanish, ORALIQ_MS).unref();
}
