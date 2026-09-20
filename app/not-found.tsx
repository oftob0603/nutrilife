import { TugmaHavola } from "@/app/_components/Tugma";

/** Next'ning inglizcha standart 404 ekrani o'rniga (CLAUDE.md: matnlar o'zbekcha). */
export default function TopilmadiSahifasi() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-8 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-sarlavha">Sahifa topilmadi</h1>
        <p className="text-asosiy text-matn-2">
          Bu havola eskirgan yoki noto&apos;g&apos;ri yozilgan. Asosiy sahifadan davom
          eting.
        </p>
      </div>
      <TugmaHavola href="/">Asosiyga qaytish</TugmaHavola>
    </main>
  );
}
