import { MakroChizigi } from "@/app/_components/MakroChizigi";
import { ProQulfi } from "@/app/_components/ProQulfi";
import { tarjimon, type Til } from "@/lib/lugat/tarjima";
import type { ScoreJavobi } from "@/lib/services/score-hisob";

const KARTA = "rounded-karta border border-karta-chegara bg-karta p-4";

/**
 * E1 — Nutrition Score bo'limi. PRO'da ball va to'rt qismi; yozuv hali yo'q (yoki makrosiz)
 * bo'lsa ball o'rnida izoh — 0 ko'rsatilmaydi; PRO bo'lmaganlarga qulf kartasi. `yozuvBor` —
 * kunda yozuv bor-u ball chiqmagan holatni (makrolar kiritilmagan) bo'sh kundan ajratadi.
 * Yozuvsiz o'tgan kunda bo'lim umuman chiqmaydi.
 */
export function ScoreKartasi({
  til,
  score,
  bugunmi,
  yozuvBor,
}: {
  til: Til;
  score: ScoreJavobi;
  bugunmi: boolean;
  yozuvBor: boolean;
}) {
  const { t } = tarjimon(til);
  if (!score.yopiq && !score.natija && !yozuvBor && !bugunmi) return null;

  let mazmun: React.ReactNode;
  if (score.yopiq) {
    mazmun = (
      <ProQulfi
        sarlavha={t("Nutrition Score")}
        izoh={t("Kunlik ovqatlanish muvozanatini 0–100 ball bilan ko'rsatadi.")}
        tugma={t("PRO ni ochish")}
      />
    );
  } else if (!score.natija) {
    mazmun = (
      <p className={`${KARTA} text-izoh text-matn-2`}>
        {yozuvBor
          ? t("Ball makrolardan hisoblanadi — bu kungi yozuvlarda oqsil, yog' va uglevod kiritilmagan.")
          : t("Ball bugungi yozuvlardan hisoblanadi — birinchi ovqatni qo'shsangiz chiqadi.")}
      </p>
    );
  } else {
    const { ball, daraja, qismlar, engPast } = score.natija;
    mazmun = (
      <div className={`${KARTA} flex flex-col gap-4`}>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-[40px] leading-none tabular-nums">{ball}</span>
          <span className="text-izoh text-matn-2">{t("/ 100 · {0}", t(daraja))}</span>
        </p>
        <div className="flex flex-col gap-3">
          {qismlar.map((qism) => (
            <MakroChizigi
              key={qism.nomi}
              til={til}
              nomi={qism.nomi}
              qiymat={qism.qiymat}
              maqsad={100}
              birliksiz
            />
          ))}
        </div>
        <p className="text-izoh text-matn-2">
          {t("Eng past ko'rsatkich — {0}.", t(engPast).toLocaleLowerCase(til))}{" "}
          {t("Ball axborot uchun — tibbiy baho emas.")}
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-karta-sarlavha">{t("Nutrition Score")}</h2>
      {mazmun}
    </section>
  );
}
