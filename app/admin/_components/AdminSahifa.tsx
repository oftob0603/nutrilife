/** Bo'lim sahifasi qolipi (prototip `Page`): sarlavha qatori va bloklar, eni 1280 gacha. */
export function AdminSahifa({
  sarlavha,
  izoh,
  amallar,
  children,
}: {
  sarlavha: string;
  izoh?: string;
  amallar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-w-admin flex-col gap-6 p-4 lg:p-admin-ichki">
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-sarlavha">{sarlavha}</h1>
          {izoh && <span className="text-izoh text-matn-2">{izoh}</span>}
        </div>
        {amallar}
      </div>
      {children}
    </div>
  );
}
