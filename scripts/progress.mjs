#!/usr/bin/env node
/**
 * Kalori · progress.html generatori
 *
 * sprints/SPRINT-*.md fayllarini o'qiydi, tasklar holatini hisoblaydi va loyiha
 * ildizida progress.html ni qayta yozadi.
 *
 * Ishlatish:  node scripts/progress.mjs
 *
 * Hech qanday tashqi kutubxona ishlatilmaydi.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPRINTS_DIR = path.join(ROOT, 'sprints');
const OUT = path.join(ROOT, 'progress.html');

const LOYIHA = 'Kalori';

/* ---------- yordamchilar ---------- */

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** `**Maqsad:** matn` va `` `kod` `` kabi oddiy markdownni HTML ga aylantiradi. */
const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

function sana() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Markdown matnini `## sarlavha` bo'yicha bo'laklarga ajratadi. */
function bolimlar(md) {
  const out = {};
  const qatorlar = md.split(/\r?\n/);
  let joriy = null;
  let bufer = [];
  const yop = () => {
    if (!joriy) return;
    // Oxirgi bo'limga fayl footeri (`---` + imzo qatori) qo'shilib ketmasin.
    out[joriy] = bufer
      .join('\n')
      .replace(/\n-{3,}\s*\n+\*[^\n]*vibecoding\.uz\*\s*$/, '')
      .trim();
  };
  for (const q of qatorlar) {
    const m = q.match(/^##\s+(.+?)\s*$/);
    if (m) {
      yop();
      joriy = m[1];
      bufer = [];
    } else if (joriy) {
      bufer.push(q);
    }
  }
  yop();
  return out;
}

/** `<!-- ... -->` izohlarini va bo'sh qatorlarni tozalaydi. */
function tozala(s) {
  if (!s) return '';
  return s
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\r?\n/)
    .map((q) => q.trim())
    .filter(Boolean)
    .join('\n')
    .trim();
}

/** Ro'yxat qatorlarini (`- ...`) massivga aylantiradi. */
function royxat(s) {
  return tozala(s)
    .split(/\r?\n/)
    .map((q) => q.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

/* ---------- sprintlarni o'qish ---------- */

function sprintlarniOqi() {
  if (!fs.existsSync(SPRINTS_DIR)) return [];

  return fs
    .readdirSync(SPRINTS_DIR)
    .filter((f) => /^SPRINT-\d+-.+\.md$/i.test(f))
    .sort((a, b) => {
      const n = (f) => Number(f.match(/^SPRINT-(\d+)/i)[1]);
      return n(a) - n(b);
    })
    .map((fayl) => {
      const md = fs.readFileSync(path.join(SPRINTS_DIR, fayl), 'utf8');
      const sarlavha = (md.match(/^#\s+(.+?)\s*$/m) || [, fayl])[1];
      const raqam = Number(fayl.match(/^SPRINT-(\d+)/i)[1]);
      const b = bolimlar(md);

      const maqsad = (md.match(/^\*\*Maqsad:\*\*\s*(.+?)\s*$/m) || [, ''])[1];
      const savol = (md.match(/^\*\*Savol:\*\*\s*(.+?)\s*$/m) || [, ''])[1];

      const tasklar = [];
      for (const q of (b['Tasklar'] || '').split(/\r?\n/)) {
        const m = q.match(/^-\s+\[([ xX])\]\s+(.+?)\s*$/);
        if (m) tasklar.push({ bajarildi: m[1].toLowerCase() === 'x', matn: m[2] });
      }

      const bajarildi = tasklar.filter((t) => t.bajarildi).length;
      const jami = tasklar.length;
      const foiz = jami ? Math.round((bajarildi / jami) * 100) : 0;

      let holat = 'boshlanmagan';
      if (jami && bajarildi === jami) holat = 'tugallangan';
      else if (bajarildi > 0) holat = 'jarayonda';

      return {
        fayl,
        raqam,
        sarlavha,
        maqsad,
        savol,
        tasklar,
        bajarildi,
        jami,
        foiz,
        holat,
        mezon: royxat(b['Qabul mezoni']),
        yoq: tozala(b["Bu sprintda YO'Q"]),
        hisobot: royxat(b['Hisobot']),
        handoff: tozala(b['Handoff']),
      };
    });
}

/* ---------- qo'shimcha kontekst ---------- */

function ochiqSavollarSoni() {
  const f = path.join(ROOT, 'DECISIONS.md');
  if (!fs.existsSync(f)) return null;
  const md = fs.readFileSync(f, 'utf8');
  const bolim = md.split(/^##\s+OCHIQ SAVOLLAR\s*$/m)[1];
  if (!bolim) return null;
  return (bolim.match(/^\|\s*\d+\s*\|/gm) || []).length || null;
}

function savalaQarori() {
  const f = path.join(ROOT, 'SAVALA.md');
  if (!fs.existsSync(f)) return null;
  const md = fs.readFileSync(f, 'utf8');
  const m = md.match(/^\*\*(GO|SHARTLI GO|NO-GO)\*\*/m);
  return m ? m[1] : null;
}

/* ---------- HTML ---------- */

function belgi(holat) {
  if (holat === 'tugallangan') return { matn: 'Tugallandi', sinf: 'tugallangan' };
  if (holat === 'jarayonda') return { matn: 'Jarayonda', sinf: 'jarayonda' };
  return { matn: 'Boshlanmagan', sinf: 'boshlanmagan' };
}

function sprintHtml(s) {
  const b = belgi(s.holat);

  const tasklar = s.tasklar
    .map(
      (t) => `
        <li class="task ${t.bajarildi ? 'bajarildi' : ''}">
          <span class="quti" aria-hidden="true">${t.bajarildi ? '✓' : ''}</span>
          <span class="task-matn">${inline(t.matn)}</span>
        </li>`
    )
    .join('');

  const mezon = s.mezon.length
    ? `<details class="qoshimcha">
         <summary>Qabul mezoni (${s.mezon.length})</summary>
         <ul>${s.mezon.map((m) => `<li>${inline(m)}</li>`).join('')}</ul>
       </details>`
    : '';

  const yoq = s.yoq
    ? `<details class="qoshimcha">
         <summary>Bu sprintda yo'q</summary>
         <p class="muted">${inline(s.yoq)}</p>
       </details>`
    : '';

  const hisobot = s.hisobot.length
    ? `<div class="blok">
         <h4>Hisobot</h4>
         <ul class="hisobot">${s.hisobot.map((h) => `<li>${inline(h)}</li>`).join('')}</ul>
       </div>`
    : '';

  const handoff = s.handoff
    ? `<div class="blok">
         <h4>Handoff</h4>
         <p class="handoff">${inline(s.handoff).replace(/\n/g, '<br>')}</p>
       </div>`
    : '';

  return `
    <article class="sprint ${s.holat}">
      <header class="sprint-bosh">
        <div class="sprint-nom">
          <span class="raqam">S${s.raqam}</span>
          <h3>${esc(s.sarlavha.replace(/^SPRINT\s*\d+\s*—\s*/i, ''))}</h3>
        </div>
        <span class="belgi ${b.sinf}">${b.matn}</span>
      </header>

      ${s.savol ? `<p class="savol">${inline(s.savol)}</p>` : ''}
      ${s.maqsad ? `<p class="maqsad">${inline(s.maqsad)}</p>` : ''}

      <div class="chiziq" role="img" aria-label="${s.bajarildi} / ${s.jami} task bajarildi">
        <div class="chiziq-ich" style="width:${s.foiz}%"></div>
      </div>
      <p class="hisob"><strong>${s.bajarildi} / ${s.jami}</strong> task · ${s.foiz}%</p>

      <ul class="tasklar">${tasklar}</ul>

      ${hisobot}
      ${handoff}
      ${mezon}
      ${yoq}
    </article>`;
}

function html(sprintlar) {
  const jamiTask = sprintlar.reduce((a, s) => a + s.jami, 0);
  const jamiBajarildi = sprintlar.reduce((a, s) => a + s.bajarildi, 0);
  const umumiyFoiz = jamiTask ? Math.round((jamiBajarildi / jamiTask) * 100) : 0;
  const tugagan = sprintlar.filter((s) => s.holat === 'tugallangan').length;
  const joriy = sprintlar.find((s) => s.holat === 'jarayonda') || sprintlar.find((s) => s.holat === 'boshlanmagan');

  const ochiq = ochiqSavollarSoni();
  const qaror = savalaQarori();

  const stat = (qiymat, izoh) => `<div class="stat"><b>${qiymat}</b><span>${izoh}</span></div>`;

  return `<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${LOYIHA} — loyiha progressi</title>
<style>
  :root {
    color-scheme: light dark;
    --fon: #f6f7f9;
    --karta: #ffffff;
    --chegara: #e4e7ec;
    --matn: #14171f;
    --xira: #6b7280;
    --asos: #e8590c;
    --asos-yumshoq: #fff1e8;
    --yashil: #16a34a;
    --sariq: #ca8a04;
    --soya: 0 1px 2px rgba(16,24,40,.06), 0 4px 16px rgba(16,24,40,.05);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --fon: #0d0f14;
      --karta: #161a22;
      --chegara: #262c38;
      --matn: #e8eaed;
      --xira: #98a2b3;
      --asos: #ff8a4c;
      --asos-yumshoq: #2a1a11;
      --yashil: #4ade80;
      --sariq: #fbbf24;
      --soya: none;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 28px 20px 64px;
    background: var(--fon);
    color: var(--matn);
    font: 15px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif;
  }
  .sahifa { max-width: 1080px; margin: 0 auto; }
  code {
    font: 13px/1.4 ui-monospace, SFMono-Regular, Consolas, monospace;
    background: var(--asos-yumshoq); color: var(--asos);
    padding: 1px 5px; border-radius: 5px;
  }

  header.bosh { margin-bottom: 24px; }
  .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
  .logo span {
    width: 30px; height: 30px; border-radius: 9px;
    background: var(--asos); color: #fff;
    display: grid; place-items: center; font-weight: 700; font-size: 15px;
  }
  h1 { font-size: 21px; margin: 0; letter-spacing: -.2px; }
  .bosh p { margin: 2px 0 0; color: var(--xira); font-size: 13px; }

  .umumiy {
    background: var(--karta); border: 1px solid var(--chegara);
    border-radius: 16px; padding: 20px; margin: 20px 0 26px; box-shadow: var(--soya);
  }
  .umumiy-bosh { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
  .umumiy-bosh h2 { font-size: 15px; margin: 0; }
  .katta { font-size: 26px; font-weight: 700; letter-spacing: -.5px; }

  .chiziq { height: 8px; background: var(--chegara); border-radius: 99px; overflow: hidden; margin: 12px 0 0; }
  .chiziq-ich { height: 100%; background: var(--asos); border-radius: 99px; transition: width .3s; }
  .tugallangan .chiziq-ich { background: var(--yashil); }

  .statlar { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
  .stat {
    flex: 1 1 120px; background: var(--fon); border: 1px solid var(--chegara);
    border-radius: 11px; padding: 10px 12px;
  }
  .stat b { display: block; font-size: 18px; line-height: 1.3; }
  .stat span { font-size: 12px; color: var(--xira); }

  .setka { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }

  .sprint {
    background: var(--karta); border: 1px solid var(--chegara);
    border-radius: 16px; padding: 18px; box-shadow: var(--soya);
  }
  .sprint.jarayonda { border-color: var(--asos); }
  .sprint-bosh { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
  .sprint-nom { display: flex; align-items: center; gap: 9px; min-width: 0; }
  .raqam {
    flex: none; width: 28px; height: 28px; border-radius: 8px;
    background: var(--asos-yumshoq); color: var(--asos);
    display: grid; place-items: center; font-size: 12px; font-weight: 700;
  }
  .sprint h3 { font-size: 15px; margin: 0; }

  .belgi { flex: none; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 99px; border: 1px solid var(--chegara); color: var(--xira); }
  .belgi.tugallangan { color: var(--yashil); border-color: color-mix(in srgb, var(--yashil) 40%, transparent); }
  .belgi.jarayonda { color: var(--asos); border-color: color-mix(in srgb, var(--asos) 40%, transparent); }

  .savol { margin: 12px 0 2px; font-weight: 600; font-size: 13px; }
  .maqsad { margin: 0; color: var(--xira); font-size: 13px; }
  .hisob { margin: 7px 0 14px; font-size: 12px; color: var(--xira); }

  ul.tasklar { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; }
  .task { display: flex; gap: 9px; align-items: flex-start; font-size: 13px; }
  .quti {
    flex: none; width: 17px; height: 17px; margin-top: 2px; border-radius: 5px;
    border: 1.5px solid var(--chegara); display: grid; place-items: center;
    font-size: 11px; color: #fff;
  }
  .task.bajarildi .quti { background: var(--yashil); border-color: var(--yashil); }
  .task.bajarildi .task-matn { color: var(--xira); text-decoration: line-through; text-decoration-thickness: 1px; }

  .blok { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--chegara); }
  .blok h4 { margin: 0 0 7px; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: var(--xira); }
  ul.hisobot { margin: 0; padding-left: 18px; font-size: 13px; display: grid; gap: 5px; }
  .handoff { margin: 0; font-size: 13px; background: var(--asos-yumshoq); padding: 10px 12px; border-radius: 10px; }

  details.qoshimcha { margin-top: 12px; font-size: 13px; }
  details.qoshimcha summary { cursor: pointer; color: var(--xira); font-size: 12px; }
  details.qoshimcha ul { margin: 8px 0 0; padding-left: 18px; display: grid; gap: 5px; }
  .muted { color: var(--xira); margin: 8px 0 0; }

  footer { margin-top: 32px; text-align: center; font-size: 12px; color: var(--xira); }
  footer code { font-size: 12px; }

  @media (max-width: 560px) {
    body { padding: 20px 14px 48px; }
    .setka { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div class="sahifa">

  <header class="bosh">
    <div class="logo"><span>K</span><h1>${LOYIHA} — loyiha progressi</h1></div>
    <p>Yangilangan: ${sana()} · manba: <code>sprints/</code> papkasi</p>
  </header>

  <section class="umumiy">
    <div class="umumiy-bosh">
      <h2>Umumiy holat</h2>
      <span class="katta">${umumiyFoiz}%</span>
    </div>
    <div class="chiziq"><div class="chiziq-ich" style="width:${umumiyFoiz}%"></div></div>
    <div class="statlar">
      ${stat(`${jamiBajarildi} / ${jamiTask}`, 'task bajarildi')}
      ${stat(`${tugagan} / ${sprintlar.length}`, 'sprint tugallandi')}
      ${stat(joriy ? `S${joriy.raqam}` : '—', 'joriy sprint')}
      ${ochiq ? stat(ochiq, 'ochiq savol') : ''}
      ${qaror ? stat(esc(qaror), 'savala qarori') : ''}
    </div>
  </section>

  <div class="setka">
    ${sprintlar.map(sprintHtml).join('')}
  </div>

  <footer>
    Bu sahifa qo'lda tahrirlanmaydi — <code>node scripts/progress.mjs</code> uni qayta yozadi.<br>
    ${LOYIHA} · vibecoding plugin bilan yaratilgan · vibecoding.uz
  </footer>

</div>
</body>
</html>
`;
}

/* ---------- ishga tushirish ---------- */

const sprintlar = sprintlarniOqi();

if (!sprintlar.length) {
  console.error('sprints/ papkasida SPRINT-*.md fayllari topilmadi — progress.html yangilanmadi.');
  process.exit(1);
}

fs.writeFileSync(OUT, html(sprintlar), 'utf8');

const jamiTask = sprintlar.reduce((a, s) => a + s.jami, 0);
const jamiBajarildi = sprintlar.reduce((a, s) => a + s.bajarildi, 0);
console.log(
  `progress.html yangilandi — ${sprintlar.length} sprint, ${jamiBajarildi}/${jamiTask} task ` +
    `(${jamiTask ? Math.round((jamiBajarildi / jamiTask) * 100) : 0}%)`
);
