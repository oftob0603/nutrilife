// Screen 2 — payment method. Back returns to screen 1 with the selection intact.
const USULLAR = [
  { id:'click',  nomi:'Click',          caption:'Bank kartasi orqali' },
  { id:'payme',  nomi:'Payme',          caption:'Bank kartasi orqali' },
  { id:'stars',  nomi:'Telegram Stars', caption:'Telegram ichida' },
];

function PaymentMethodScreen({ plan, onBack, onPick }) {
  return (
    <div className="flex h-full flex-col bg-[var(--page)] text-[var(--ink)]">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-6">
        <button type="button" onClick={onBack} aria-label="Orqaga"
          className="-ml-3 flex h-11 w-11 items-center justify-center">
          <Icon name="chevron-left" size={24}/>
        </button>

        <div className="mt-2 flex items-center gap-3 rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-4">
          <span className="rounded-[12px] px-2 py-[2px] text-[11px] font-medium"
            style={{ backgroundImage:'var(--pro-gradient)', backgroundOrigin:'border-box', backgroundClip:'border-box', color:'var(--pro-fg)' }}>PRO</span>
          <span className="min-w-0 flex-1 font-tight text-[17px] font-semibold tracking-[-0.02em] tabular-nums">
            {plan.nomi} · {som(plan.price)} so'm
          </span>
        </div>

        <h1 className="mt-6 font-tight text-[24px] font-semibold leading-[1.15] tracking-[-0.02em]">
          To'lov usulini tanlang
        </h1>

        <div className="mt-6 flex flex-col gap-3">
          {USULLAR.map(u => (
            <button key={u.id} type="button" onClick={()=>onPick(u.id)}
              className="flex min-h-[72px] w-full items-center gap-3 rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-4 text-left">
              {/* Logo slot — no brand marks were supplied, so the slot shows the name. */}
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[var(--border)] text-[11px] font-medium text-[var(--text-3)]">
                {u.nomi.slice(0,2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-tight text-[17px] font-semibold tracking-[-0.02em]">{u.nomi}</span>
                <span className="mt-1 block text-[13px] text-[var(--text-2)]">{u.caption}</span>
              </span>
              <Icon name="chevron-right" size={20} color="var(--text-3)"/>
            </button>
          ))}
        </div>

        <p className="mt-4 text-[13px] text-[var(--text-2)]">To'langan pul qaytarilmaydi</p>
        <a href="#" onClick={(e)=>e.preventDefault()}
          className="mt-2 inline-block text-[13px] underline-offset-2 hover:underline">Foydalanish shartlari</a>
      </div>
    </div>
  );
}
