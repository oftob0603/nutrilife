// A6 dish database, A7 dish editor, A8 recipe list, A9 recipe editor

// Categories use the shared create dialog; this just fixes its copy in one place.
function KategoriyaDialog({ open, onClose, onAdded }) {
  return (
    <RoyxatDialog open={open} onClose={onClose} onAdded={onAdded} list="kategoriya"
      title="Yangi kategoriya"
      description="Kategoriya barcha taom va retsept shakllarida darhol paydo bo'ladi."/>
  );
}

function A6({ openDish }) {
  const [q,setQ] = React.useState('');
  const [filter,setFilter] = React.useState('Hammasi');
  const rows = DISHES.filter(d=>{
    if (filter==='Tarjimasi yo\'q' && d.ru && d.en) return false;
    return !q || (d.uz+d.ru+d.en).toLowerCase().includes(q.toLowerCase());
  });
  return (
    <Page title="Taomlar bazasi" actions={<Button variant="primary" onClick={()=>openDish(null)}>Yangi taom</Button>}>
      <Toolbar>
        <SearchField style={{ flex:1, minWidth:280 }} value={q} onChange={setQ} placeholder="Taom nomi"/>
        {['Hammasi',"O'zbekcha",'Ruscha','Inglizcha',"Tarjimasi yo'q"].map(t=>(
          <Chip key={t} selected={filter===t} onClick={()=>setFilter(t)}>{t}</Chip>
        ))}
      </Toolbar>
      <DataTable onRowClick={openDish}
        columns={[
          { key:'uz', label:"O'zbekcha", width:'minmax(0,1.2fr)' },
          { key:'ru', label:'Ruscha', width:'minmax(0,1.2fr)', render:d=>d.ru||<span style={{color:'var(--xato)'}}>yo'q</span> },
          { key:'en', label:'Inglizcha', width:'minmax(0,1.2fr)', render:d=>d.en||<span style={{color:'var(--xato)'}}>yo'q</span> },
          { key:'porsiya', label:'Porsiya', width:'92px', align:'right', numeric:true, render:d=>d.porsiya+' g' },
          { key:'kkal', label:'kkal/100g', width:'96px', align:'right', numeric:true },
          { key:'makro', label:'Makrolar', width:'132px', muted:true, numeric:true, render:d=>d.oqsil+' / '+d.yog+' / '+d.uglevod },
          { key:'rasm', label:'Rasm', width:'72px', render:d=>d.rasm?<Icon name="check" size={16}/>:<span style={{color:'var(--matn-3)'}}>—</span> },
          { key:'sana', label:"Qo'shilgan", width:'112px', numeric:true, muted:true },
        ]}
        rows={rows}
        empty={<EmptyState icon="search-x" title="Taom topilmadi"/>}/>
    </Page>
  );
}

function A7({ dish, back }) {
  const d = dish || { uz:'', ru:'', en:'', porsiya:'', kkal:'', oqsil:'', yog:'', uglevod:'', kat:'Ikkinchi taom' };
  const [v,setV] = React.useState(d);
  const [kats,setKats] = React.useState(kategoriyalar);
  const [katDialog,setKatDialog] = React.useState(false);
  const set = (k)=>(val)=>setV(s=>({ ...s, [k]:val }));
  const hisob = 4*Number(v.oqsil||0) + 9*Number(v.yog||0) + 4*Number(v.uglevod||0);
  const kkal = Number(v.kkal||0);
  const farq = kkal>0 && hisob>0 ? Math.abs(hisob-kkal)/kkal : 0;
  const bad = !v.uz.trim() || !v.ru.trim() || !v.en.trim();
  return (
    <Page title={dish ? v.uz : 'Yangi taom'}
      actions={<span style={{ display:'flex', gap:'var(--space-2)' }}>
        <Button variant="tertiary" onClick={back}>Bekor qilish</Button>
        <Button variant="primary" disabled={bad} onClick={back}>Saqlash</Button>
      </span>}>
      <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
        <span style={{ font:'var(--type-card-title)' }}>Nomi — uchalasi ham majburiy</span>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'var(--space-3)' }}>
          <Input label="O'zbekcha" value={v.uz} onChange={set('uz')} error={!v.uz.trim()?'Majburiy':undefined}/>
          <Input label="Ruscha" value={v.ru} onChange={set('ru')} error={!v.ru.trim()?'Majburiy':undefined}/>
          <Input label="Inglizcha" value={v.en} onChange={set('en')} error={!v.en.trim()?'Majburiy':undefined}/>
        </div>
      </Card>
      <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
        <span style={{ font:'var(--type-card-title)' }}>Qiymatlar</span>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'var(--space-3)' }}>
          <Input label="Standart porsiya" value={v.porsiya} onChange={set('porsiya')} unit="g" numeric/>
          <Input label="100 g uchun" value={v.kkal} onChange={set('kkal')} unit="kkal" numeric/>
          <Input label="Oqsil" value={v.oqsil} onChange={set('oqsil')} unit="g" numeric/>
          <Input label="Yog'" value={v.yog} onChange={set('yog')} unit="g" numeric/>
          <Input label="Uglevod" value={v.uglevod} onChange={set('uglevod')} unit="g" numeric/>
        </div>
        {farq > 0.2 && (
          <Note tone="warn" title="Makrolar kaloriyaga mos kelmayapti">
            4×oqsil + 9×yog' + 4×uglevod = {Math.round(hisob)} kkal, kiritilgani {kkal} kkal —
            farq {Math.round(farq*100)}%. Tekshirib ko'ring.
          </Note>
        )}
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--card-gap)' }}>
        <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
          <span style={{ font:'var(--type-card-title)' }}>Kategoriya</span>
          <Select value={v.kat} onChange={set('kat')} options={kats}
            createLabel="Yangi qo'shish" onCreate={()=>setKatDialog(true)}/>
        </Card>
        <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
          <span style={{ font:'var(--type-card-title)' }}>Rasm</span>
          <div style={{ height:96, borderRadius:'var(--r-card)', border:'1px dashed var(--chegara)', display:'flex', alignItems:'center', justifyContent:'center', gap:'var(--space-2)', color:'var(--matn-3)', font:'var(--type-caption)' }}>
            <Icon name="upload" size={16}/> Rasm yuklash
          </div>
        </Card>
      </div>
      <KategoriyaDialog open={katDialog} onClose={()=>setKatDialog(false)}
        onAdded={(nom)=>{ setKats(kategoriyalar()); setV(s=>({ ...s, kat:nom })); }}/>
    </Page>
  );
}

function A8({ openRecipe }) {
  const [kat,setKat] = React.useState('Hammasi');
  const [holat,setHolat] = React.useState('Hammasi');
  const rows = RECIPES.filter(r=>(kat==='Hammasi'||r.kat===kat)&&(holat==='Hammasi'||r.holat===holat));
  return (
    <Page title="Retseptlar" actions={<Button variant="primary" onClick={()=>openRecipe(null)}>Yangi retsept</Button>}>
      <Toolbar>
        {/* A filter, so it lists the categories that exist but offers no create row —
            a new category with nothing in it would filter the table to empty. */}
        <Select style={{ width:220 }} value={kat} onChange={setKat}
          options={['Hammasi'].concat(kategoriyalar())}/>
        {['Hammasi','Chop etilgan','Qoralama'].map(t=>(
          <Chip key={t} selected={holat===t} onClick={()=>setHolat(t)}>{t}</Chip>
        ))}
      </Toolbar>
      <DataTable onRowClick={openRecipe}
        columns={[
          { key:'nomi', label:'Nomi', width:'minmax(160px,2fr)', render:r=>r.nomi.uz },
          { key:'kat', label:'Kategoriya', width:'minmax(0,1.2fr)', muted:true },
          { key:'kkal', label:'kkal', width:'80px', align:'right', numeric:true },
          { key:'vaqt', label:'Vaqt', width:'90px', align:'right', numeric:true, render:r=>r.vaqt+' daq' },
          { key:'murakkab', label:'Murakkablik', width:'110px', muted:true },
          { key:'mazmun', label:'Mazmuni', width:'170px', muted:true, render:r=>{
            const m = (r.masalliqlar.uz||[]).length;
            const steps = ((r.qadamlar||{}).uz||[]).filter(x=>String(x).trim()).length;
            return m + ' masalliq · ' + (steps ? steps + ' qadam' : 'qadam yo\'q');
          } },
          { key:'holat', label:'Holat', width:'130px', render:r=>(
            <Badge tone={r.holat==='Qoralama'?'neutral':'ai'}>{r.holat}</Badge>) },
        ]}
        rows={rows}
        empty={<EmptyState icon="book-open" title="Retsept topilmadi"/>}/>
    </Page>
  );
}

const BLANK_RECIPE = {
  nomi:{ uz:'', ru:'', en:'' }, kat:'Ikkinchi taom', kkal:'', oqsil:'', vaqt:'',
  murakkab:'Oson', porsiya:'', pro:true,
  masalliqlar:{ uz:[], ru:[], en:[] }, qadamlar:{ uz:[], ru:[], en:[] },
};

function A9({ recipe, back }) {
  const [v,setV] = React.useState(recipe || BLANK_RECIPE);
  const [kats,setKats] = React.useState(kategoriyalar);
  const [katDialog,setKatDialog] = React.useState(false);
  const set = (k)=>(val)=>setV(s=>({ ...s, [k]:val }));
  const [lang,setLang] = React.useState('uz');
  const LANG_LABEL = { uz:"o'zbekcha", ru:'ruscha', en:'inglizcha' };
  const setLangField = (field)=>(text)=>setV(s=>({
    ...s, [field]:{ ...s[field], [lang]: text.split('\n') },
  }));
  const setName = (text)=>setV(s=>({ ...s, nomi:{ ...s.nomi, [lang]:text } }));
  const lines = (field)=>(v[field][lang]||[]).join('\n');
  const Lock = ({ free }) => (
    <Badge tone={free?'neutral':'ai'} style={{ marginLeft:'var(--space-2)' }}>
      {free ? 'FREE ga ko\'rinadi' : 'PRO ostida'}
    </Badge>
  );
  return (
    <Page title={recipe ? v.nomi.uz : 'Yangi retsept'}
      actions={<span style={{ display:'flex', gap:'var(--space-2)' }}>
        <Button variant="tertiary" onClick={back}>Bekor qilish</Button>
        <Button variant="secondary" onClick={back}>Saqlash (qoralama)</Button>
        <Button variant="primary" onClick={back}>Chop etish</Button>
      </span>}>
      <Toolbar>
        <SegmentedControl style={{ maxWidth:360 }} value={lang} onChange={setLang}
          options={[{value:'uz',label:"O'zbekcha"},{value:'ru',label:'Ruscha'},{value:'en',label:'Inglizcha'}]}/>
      </Toolbar>
      <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
        <span style={{ font:'var(--type-card-title)' }}>Sarlavha<Lock free/></span>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'var(--space-3)' }}>
          <Input label={'Nomi — ' + LANG_LABEL[lang]} value={v.nomi[lang]} onChange={setName}/>
          <Select label="Kategoriya" value={v.kat} onChange={set('kat')} options={kats}
            createLabel="Yangi qo'shish" onCreate={()=>setKatDialog(true)}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'var(--space-3)' }}>
          <Input label="Kaloriya" value={v.kkal} onChange={set('kkal')} unit="kkal" numeric/>
          <Input label="Oqsil" value={v.oqsil} onChange={set('oqsil')} unit="g" numeric/>
          <Input label="Porsiya" value={v.porsiya} onChange={set('porsiya')}/>
          <Input label="Tayyorlash vaqti" value={v.vaqt} onChange={set('vaqt')} unit="daq" numeric/>
          {/* Fixed scale — a fourth difficulty would mean nothing to the app, so no
              create row here. */}
          <Select label="Murakkablik" value={v.murakkab} onChange={set('murakkab')} options={['Oson',"O'rta",'Qiyin']}/>
        </div>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
          Sarlavha va tayyorlash vaqti FREE foydalanuvchiga ko'rinadi
        </span>
      </Card>
      <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
        <span style={{ font:'var(--type-card-title)' }}>Masalliqlar va qadamlar<Lock /></span>
        <Textarea label={'Masalliqlar — ' + LANG_LABEL[lang]} rows={5}
          value={lines('masalliqlar')} onChange={setLangField('masalliqlar')}
          placeholder="Har qatorda bitta masalliq"
          hint={(v.masalliqlar[lang]||[]).filter(x=>x.trim()).length + ' ta masalliq'}/>
        <Textarea label={'Tayyorlash qadamlari — ' + LANG_LABEL[lang]} rows={7}
          value={lines('qadamlar')} onChange={setLangField('qadamlar')}
          placeholder="Har qatorda bitta qadam — bo'sh qoldirsangiz ilovada bu bo'lim ko'rinmaydi"
          hint={hasSteps(v,lang)
            ? v.qadamlar[lang].filter(x=>x.trim()).length + ' ta qadam'
            : "Qadam kiritilmagan — ilovada «Tayyorlash» bo'limi umuman chiqmaydi"}/>
      </Card>
      <KategoriyaDialog open={katDialog} onClose={()=>setKatDialog(false)}
        onAdded={(nom)=>{ setKats(kategoriyalar()); setV(s=>({ ...s, kat:nom })); }}/>
    </Page>
  );
}

Object.assign(window, { A6, A7, A8, A9, KategoriyaDialog });
