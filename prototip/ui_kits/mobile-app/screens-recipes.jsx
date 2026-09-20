// Retseptlar tab — grid, paywall, detail. Every value comes from the shared recipe store
// (ui_kits/shared/recipes.js), which is what the admin panel's A9 editor writes to.
const RECIPE_LANG = 'uz';

function RecipeMeta({ recipe, muted }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-2)' }}>
      <Badge tone="neutral">{t1('{0} kkal', fmt(recipe.kkal))}</Badge>
      <Badge tone="neutral">{t(recipe.murakkab)}</Badge>
      {!muted && <Badge tone="neutral">{recipe.kat}</Badge>}
    </div>
  );
}

// Calories sit in their own element directly under the image — never inside the
// descriptive line with the recipe name.
function KcalLine({ kcal }) {
  return (
    <span style={{ display:'flex', alignItems:'center', gap:'var(--space-1)' }}>
      <Icon name="flame" size={14} color="var(--matn-2)"/>
      <span style={{ font:'var(--type-badge)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
        {t1('{0} kkal', fmt(kcal))}
      </span>
    </span>
  );
}

function FavouriteButton({ app, id, size = 32 }) {
  const open = proOpen('sevimli', app);
  const on = open && app.isFavourite(id);
  return (
    <button type="button" aria-label="Sevimlilarga qo'shish"
      aria-pressed={on}
      onClick={(e)=>{ e.stopPropagation(); open ? app.toggleFavourite(id) : app.openTariffs('sevimli'); }}
      style={{
        width:size, height:size, flex:'0 0 auto', border:0, borderRadius:'var(--r-pill)',
        background:'var(--karta)', color:on?'var(--xato)':'var(--matn-3)',
        display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
        boxShadow:'none',
      }}>
      <Icon name={on ? 'heart' : open ? 'heart' : 'lock'} size={16}
        style={on ? { fill:'currentColor' } : undefined}/>
    </button>
  );
}

function RecipeCard({ recipe, locked, onClick, app }) {
  const [pressed,setPressed] = React.useState(false);
  return (
    <Card padded={false} onClick={onClick}
      onPointerDown={()=>setPressed(true)} onPointerUp={()=>setPressed(false)} onPointerLeave={()=>setPressed(false)}
      style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ position:'relative', overflow:'hidden' }}>
        <div style={{
          filter: locked ? 'blur(6px)' : undefined,
          transform: locked ? 'scale(1.08)' : (pressed ? 'scale(1.02)' : 'scale(1)'),
          transition:'transform var(--asos) var(--ease)',
        }}>
          <FoodImage src={recipe.rasm || undefined} radius="0"
            style={{ height:104, aspectRatio:'auto', width:'100%' }}/>
        </div>
        <span style={{ position:'absolute', top:'var(--space-2)', left:'var(--space-2)' }}>
          <FavouriteButton app={app} id={recipe.id}/>
        </span>
        {locked && (
          <span style={{
            position:'absolute', top:'var(--space-2)', right:'var(--space-2)',
            display:'inline-flex', alignItems:'center', gap:4,
            backgroundImage:'var(--pro-gradient)', backgroundOrigin:'border-box',
            backgroundClip:'border-box', color:'var(--pro-fg)',
            borderRadius:'var(--r-pill)', padding:'2px var(--space-2)', font:'var(--type-badge)',
            pointerEvents:'none',
          }}>
            <Icon name="lock" size={12}/>{t('PRO')}</span>
        )}
      </div>
      <div style={{ padding:'var(--card-padding)', display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
        <KcalLine kcal={recipe.kkal}/>
        <span style={{ font:'var(--type-card-title)' }}>{recipe.nomi[RECIPE_LANG]}</span>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t(recipe.murakkab)}</span>
      </div>
    </Card>
  );
}

function RecipesScreen({ app }) {
  const { openRecipe, tab, setTab, openSheet } = app;
  const [kat,setKat] = React.useState('Hammasi');
  const db = app.recipes || [];
  const all = db.filter(r=>r.holat==='Chop etilgan');
  /* Category values stay UZBEK — they are identity, compared against `kat` and against
     each recipe's own `kat` from the database. Translating them here (an earlier pass did)
     broke filtering in ru/en, because `kat === 'Sevimli'` could never match a translated
     chip. Display translation happens at render, in the Chip below.

     Only the two BUILT-IN categories are translated for display. A category the admin
     typed is database content and is shown verbatim — otherwise an admin category that
     happened to collide with a dictionary key («Vazn», «Holat») would silently render in
     another language than the admin wrote it. */
  const cats = ['Sevimli','Hammasi'].concat(all.map(r=>r.kat).filter((k,i,arr)=>arr.indexOf(k)===i));
  const katLabel = (c) => (c === 'Sevimli' || c === 'Hammasi' ? t(c) : c);
  const rows = kat === 'Sevimli' ? all.filter(r=>app.isFavourite(r.id))
    : kat === 'Hammasi' ? all : all.filter(r=>r.kat === kat);

  return (
    <>
      {app.offline && <OfflineBar/>}
      <Scroll>
        <ScreenHeader subtitle={t1('{0} ta retsept', all.length)} title={t('Retseptlar')}/>
        <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:140 }}>
          <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
            {cats.map(c=>(
              <Chip key={c} selected={kat===c} pro={c === 'Sevimli' && !proOpen('sevimli', app)}
                onClick={()=>c==='Sevimli' && !proOpen('sevimli', app)
                  ? app.openTariffs('sevimli') : setKat(c)}>
                {c === 'Sevimli' && !proOpen('sevimli', app) ? t('Sevimli') + ' \u00b7 PRO' : katLabel(c)}
              </Chip>
            ))}
          </div>

          {all.length === 0 ? (
            <EmptyState icon="book-open" title={t("Hozircha retsept yo'q")}
              body="Yangi retseptlar qo'shilgach shu yerda ko'rinadi."/>
          ) : rows.length === 0 ? (
            kat === 'Sevimli' ? (
              <EmptyState icon="heart" title={t("Sevimli retsept yo'q")}
                body="Retsept ustidagi yurakni bossangiz, shu yerda yig'iladi."/>
            ) : (
              <EmptyState icon="search-x" title={'«'+kat+'» bo\'yicha retsept yo\'q'}/>
            )
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0,1fr))', gap:'var(--card-gap)' }}>
              {rows.map(r=>(
                <RecipeCard key={r.id} recipe={r} app={app} locked={r.pro && !proOpen('retsept', app)}
                  onClick={()=>openRecipe(r.id)}/>
              ))}
            </div>
          )}
        </div>
      </Scroll>
      <div style={{ position:'absolute', left:'var(--screen-gutter)', right:'var(--screen-gutter)', bottom:'var(--above-bottom-bar)' }}>
        <BottomBar value={tab} onChange={setTab} onAdd={openSheet}/>
      </div>
    </>
  );
}

// Shown instead of the detail screen when a FREE user taps a PRO recipe.
function RecipePaywallScreen({ app }) {
  const r = (app.recipes || []).find(x=>x.id===app.recipeId);
  if (!r) return null;
  const items = (r.masalliqlar[RECIPE_LANG] || []).filter(x=>String(x).trim());
  const steps = (r.qadamlar[RECIPE_LANG] || []).filter(x=>String(x).trim());

  return (
    <Scroll>
      <ScreenHeader onBack={()=>app.go('recipes')} subtitle={r.kat} title={r.nomi[RECIPE_LANG]}/>
      <div style={{
        padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column',
        gap:'var(--block-gap)', paddingBottom:'var(--space-12)',
      }}>
        <div style={{ position:'relative', borderRadius:'var(--r-card)', overflow:'hidden' }}>
          <div style={{ filter:'blur(10px)', transform:'scale(1.08)' }}>
            <FoodImage src={r.rasm || undefined} radius="0"
              style={{ height:200, aspectRatio:'auto', width:'100%' }}/>
          </div>
          <span style={{
            position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{
              width:56, height:56, borderRadius:'50%', background:'var(--siyoh)',
              color:'var(--on-siyoh)', display:'inline-flex', alignItems:'center', justifyContent:'center',
            }}><Icon name="lock" size={24}/></span>
          </span>
        </div>

        <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)', alignItems:'flex-start' }}>
          <Badge tone="pro" onClick={()=>app.openTariffs('retsept')}>{t('PRO')}</Badge>
          <span style={{ font:'var(--type-screen-title)', letterSpacing:'var(--ls-title)' }}>{t('Bu retsept PRO obunada')}</span>
          <span style={{ font:'var(--type-body)', color:'var(--matn-2)' }}>
            To'liq retseptni ko'rish uchun PRO obuna kerak.
          </span>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)', width:'100%' }}>
            {[
              ['flame', fmt(r.kkal) + ' kkal · ' + r.porsiya],
              ['list', items.length + ' ta masalliq'],
            ].concat(steps.length ? [['chef-hat', steps.length + ' ta tayyorlash qadami']] : [])
             .concat([['book-open', 'Barcha retseptlar ochiladi']])
             .map(([ic,t])=>(
              <span key={t} style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', font:'var(--type-body)' }}>
                <Icon name={ic} size={18} color="var(--matn-2)"/>{t}
              </span>
            ))}
          </div>
          <Button variant="pro" full onClick={()=>app.openTariffs('retsept')}>{t('PRO ni ochish')}</Button>
          <Button variant="tertiary" full onClick={()=>app.go('recipes')}>{t('Hozir emas')}</Button>
        </Card>
      </div>
    </Scroll>
  );
}

function RecipeScreen({ app }) {
  const r = (app.recipes || []).find(x=>x.id===app.recipeId);
  if (!r) return null;
  const steps = r.qadamlar[RECIPE_LANG] || [];
  const showSteps = steps.filter(x=>String(x).trim()).length > 0;
  const items = r.masalliqlar[RECIPE_LANG] || [];

  return (
    <>
      <Scroll>
        <ScreenHeader onBack={()=>app.go('recipes')} subtitle={r.kat} title={r.nomi[RECIPE_LANG]}
          action={<FavouriteButton app={app} id={r.id} size={44}/>}/>
        <div style={{
          padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column',
          gap:'var(--block-gap)', paddingBottom:'var(--space-12)',
        }}>
          <FoodImage src={r.rasm || undefined} radius="var(--r-card)"
            style={{ height:200, aspectRatio:'auto' }}/>

          <Section title={t('Bir porsiyada')}>
            <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:'var(--space-2)' }}>
                <span style={{ font:'var(--type-ring)', fontSize:40, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{fmt(r.kkal)}</span>
                <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>kkal · {r.porsiya}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
                <MacroBar label={t('Oqsil')} value={r.oqsil} goal={GOALS.p} />
                <MacroBar label={t("Yog'")} value={r.yog} goal={GOALS.fat} />
                <MacroBar label={t('Uglevod')} value={r.uglevod} goal={GOALS.c} />
              </div>
              <RecipeMeta recipe={r} muted/>
            </Card>
          </Section>

          <Section title={t('Masalliqlar')}>
            <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              {items.map((m,i)=>(
                <span key={i} style={{ display:'flex', gap:'var(--space-3)', font:'var(--type-body)' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--matn-3)', flex:'0 0 auto', marginTop:9 }}/>
                  <span style={{ flex:1, minWidth:0 }}>{m}</span>
                </span>
              ))}
            </Card>
          </Section>

          {showSteps && (
            <Section title={t('Tayyorlash')}>
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
                {steps.map((s,i)=>(
                  <Card key={i} style={{ display:'flex', gap:'var(--space-3)' }}>
                    <span style={{
                      width:28, height:28, flex:'0 0 auto', borderRadius:'50%',
                      background:'var(--siyoh)', color:'var(--on-siyoh)',
                      display:'inline-flex', alignItems:'center', justifyContent:'center',
                      font:'var(--type-badge)', fontVariantNumeric:'tabular-nums',
                    }}>{i+1}</span>
                    <span style={{ flex:1, minWidth:0, font:'var(--type-body)' }}>{s}</span>
                  </Card>
                ))}
              </div>
            </Section>
          )}
        </div>
      </Scroll>
    </>
  );
}

Object.assign(window, { RecipesScreen, RecipeScreen, RecipePaywallScreen, RecipeCard, RecipeMeta, KcalLine, FavouriteButton });
