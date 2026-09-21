import { ProBelgisi } from "@/app/_components/ProBelgisi";
import { TugmaHavola } from "@/app/_components/Tugma";

/**
 * Yopiq PRO imkoniyati o'rnidagi karta (prototip `ProLock`): nima yopiqligi, qisqa izoh va
 * tariflar ekraniga (W1) yo'l. Matnlar tarjima qilingan holda beriladi.
 */
export function ProQulfi({
  sarlavha,
  izoh,
  tugma,
}: {
  sarlavha: string;
  izoh?: string;
  tugma: string;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-karta border border-chegara bg-karta p-4">
      <ProBelgisi />
      <p className="text-karta-sarlavha">{sarlavha}</p>
      {izoh && <p className="text-izoh text-matn-2">{izoh}</p>}
      <TugmaHavola korinish="pro" href="/pro?manba=imkoniyat">
        {tugma}
      </TugmaHavola>
    </div>
  );
}
