// Screen 1 — tariffs. "Hozir emas" is always mounted and always closes: never a dead end.
//
// The layout is presentational only: same plans, same prices, same nine benefits from the
// shared registry, same handlers. Two composition notes:
//
//  · The per-month figure and the savings percent are pulled apart into their own
//    elements instead of sharing one caption line, because they answer different
//    questions (what it costs to run, versus what it saves). The VALUES still come from
//    oyiga() and tejash() — nothing is restated or hardcoded, so an admin price change
//    still flows through.
//  · The bottom action area keeps its seamless treatment — no card, border or scrim —
//    per the earlier direction that it sit directly on the page.

// The per-month line, composed from the same helpers planTavsifi uses.
function oyigaMatni(plan) {
  return (plan.months === 1 ? '' : '\u2248') + som(oyiga(plan)) + " so'm / oy";
}

function BenefitRow({ benefit, last }) {
  return (
    <li className="flex items-center gap-3 py-[10px]"
      style={last ? null : { borderBottom:'1px solid var(--border)' }}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
        style={{ background:'var(--pro-tint)' }}>
        <Icon name={benefit.icon} size={16} color="var(--pro-ink)"/>
      </span>
      <span className="text-[15px] leading-snug">{benefit.text}</span>
    </li>
  );
}

function PlanCard({ plan, monthly, selected, onSelect }) {
  const saving = tejash(plan, monthly);
  /* A 2px border in BOTH states, so selecting a plan cannot shift the layout. The
     selected ring is the PRO gradient drawn as a border-box layer under a padding-box
     card fill — the standard way to paint a gradient border without a wrapper element. */
  const frame = selected
    ? { border:'2px solid transparent',
        backgroundImage:'linear-gradient(var(--card),var(--card)), var(--pro-gradient)',
        backgroundOrigin:'border-box', backgroundClip:'padding-box, border-box' }
    : { border:'2px solid var(--border)', background:'var(--card)' };

  return (
    <button type="button" role="radio" aria-checked={selected} onClick={() => onSelect(plan.id)}
      className={'pw-press flex w-full items-center gap-3 rounded-[20px] p-4 text-left' +
        (plan.badge && selected ? ' pw-glow' : '')}
      style={frame}>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-tight text-[17px] font-semibold tracking-[-0.02em]">{plan.nomi}</span>
          {plan.badge && (
            <span className="pw-shimmer inline-block rounded-[12px] px-2 py-[2px] text-[11px] font-medium"
              style={{ backgroundImage:'var(--pro-gradient)', color:'var(--pro-fg)' }}>
              {plan.badge}
            </span>
          )}
        </span>
        <span className="mt-[6px] block text-[13px] text-[var(--text-2)] tabular-nums">
          {oyigaMatni(plan)}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-[6px]">
        <span className="font-tight text-[17px] font-semibold tracking-[-0.02em] tabular-nums whitespace-nowrap">
          {som(plan.price)} so'm
        </span>
        {saving > 0 && (
          <span className="rounded-[999px] px-2 py-[2px] text-[11px] font-medium tabular-nums whitespace-nowrap"
            style={{ background:'var(--pro-tint)', color:'var(--pro-ink)' }}>
            {saving}% tejash
          </span>
        )}
      </span>
    </button>
  );
}

function TariffsScreen({ source = 'profile', plans = PLANS, state = 'ready', selected, onSelect, onContinue, onDismiss, onRetry }) {
  const monthly = (plans.find(p => p.months === 1) || {}).price || 0;

  return (
    <div className="relative h-full bg-[var(--page)] text-[var(--ink)]">
      <div className="no-bar absolute inset-0 overflow-y-auto px-4 pt-6" style={{ paddingBottom:'calc(148px + env(safe-area-inset-bottom, 0px))' }}>
        <h1 className="font-tight text-[28px] font-semibold leading-[1.12] tracking-[-0.02em]">
          {SARLAVHA[source]}
        </h1>

        <ul className="mt-5 rounded-[20px] border border-[var(--border)] bg-[var(--card)] px-4 py-1">
          {BENEFITS.map((b, i) => (
            <BenefitRow key={b.text} benefit={b} last={i === BENEFITS.length - 1}/>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-3">
          {state === 'loading' ? (
            [0,1,2].map(i => (
              <div key={i} className="h-[84px] rounded-[20px] border-2 border-[var(--border)] bg-[var(--card)] p-4">
                <div className="h-4 w-24 rounded-[999px] bg-[var(--skeleton)]"/>
                <div className="mt-3 h-3 w-40 rounded-[999px] bg-[var(--skeleton)]"/>
              </div>
            ))
          ) : state === 'error' ? (
            <div className="rounded-[20px] border-2 border-[var(--border)] bg-[var(--card)] p-4">
              <p className="text-[15px]">Tariflarni yuklab bo'lmadi</p>
              <button type="button" onClick={onRetry}
                className="mt-3 min-h-[44px] w-full rounded-[999px] border border-[var(--border)] px-4 text-[15px] font-medium">
                Qayta urinish
              </button>
            </div>
          ) : (
            plans.map(p => (
              <PlanCard key={p.id} plan={p} monthly={monthly} selected={p.id === selected} onSelect={onSelect}/>
            ))
          )}
        </div>

        <p className="mt-4 text-[13px] leading-snug text-[var(--text-2)]">
          Avtomatik yechish yo'q. Muddat tugagach o'zingiz uzaytirasiz.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
          <a href="#" onClick={(e)=>e.preventDefault()} className="underline-offset-2 hover:underline">Foydalanish shartlari</a>
          <span className="text-[var(--text-3)]">·</span>
          <a href="#" onClick={(e)=>e.preventDefault()} className="underline-offset-2 hover:underline">Maxfiylik siyosati</a>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4"
        style={{ paddingBottom:'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        <button type="button" disabled={state !== 'ready'} onClick={onContinue}
          className="pw-press pw-sweep pointer-events-auto h-[52px] w-full rounded-[999px] text-[15px] font-medium disabled:opacity-40"
          style={{ backgroundImage:'var(--pro-gradient)', color:'var(--pro-fg)',
            backgroundOrigin:'border-box', backgroundClip:'border-box' }}>
          <span className="pw-label">Davom etish</span>
        </button>
        <button type="button" onClick={onDismiss}
          className="pointer-events-auto mt-2 min-h-[44px] w-full text-[15px] font-medium text-[var(--text-2)]">
          Hozir emas
        </button>
      </div>
    </div>
  );
}
