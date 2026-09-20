// Shared onboarding screen shell: progress header, scrolling question, pinned action.
function Step({ n, total = 12, onBack, onSkip, title, caption, children, action, actionDisabled, actionLoading, onAction, secondary, saveError }) {
  return (
    <>
      <StepProgress step={n} total={total} onBack={onBack} onSkip={onSkip}/>
      <Scroll>
        <div style={{ padding:'var(--space-2) var(--screen-gutter) var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--block-gap)' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--title-to-content)' }}>
            <h1 style={{ font:'var(--type-screen-title)', letterSpacing:'var(--ls-title)', margin:0 }}>{title}</h1>
            {caption && <p style={{ font:'var(--type-body)', color:'var(--matn-2)', margin:0 }}>{caption}</p>}
          </div>
          {children}
        </div>
      </Scroll>
      {(action || secondary || saveError) && <div style={{
        flex:'0 0 auto', padding:'var(--space-3) var(--screen-gutter) var(--space-6)',
        display:'flex', flexDirection:'column', gap:'var(--space-2)',
        background:'var(--fon)', borderTop:'var(--hairline)',
      }}>
        {saveError && <ErrorState inline title="Saqlanmadi. Qayta urinish"/>}
        {secondary}
        {action && <Button variant="primary" full disabled={actionDisabled} loading={actionLoading} onClick={onAction}>{action}</Button>}
      </div>}
    </>
  );
}

function Choices({ children }) {
  return <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>{children}</div>;
}

Object.assign(window, { Step, Choices });
