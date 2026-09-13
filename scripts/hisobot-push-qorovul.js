#!/usr/bin/env node
/**
 * Kalori · push qorovuli
 *
 * PreToolUse hook. `git push` buyrug'ini ushlaydi va progress.html sprint fayllaridan
 * eskirgan bo'lsa pushni to'xtatib, hisobotchi agentni chaqirishni so'raydi.
 *
 * Commit uchun alohida qorovul KERAK EMAS — uni vibecoding plugin hooki bajaradi.
 * Bu skript faqat push bosqichini qo'riqlaydi.
 *
 * Har qanday kutilmagan xato = jim o'tkazib yuborish (exit 0). Qorovul hech qachon
 * foydalanuvchi ishini buzmasligi kerak.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const MAX_DENY = 2; // shundan keyin o'tkazib yuboriladi (tsikldan himoya)
const STATE_TTL_MS = 30 * 60 * 1000;

const DEBUG = process.env.KALORI_HOOK_DEBUG === '1';

function dbg() {
  if (DEBUG) process.stderr.write('[qorovul] ' + Array.from(arguments).join(' ') + '\n');
}

function ok(nega) {
  dbg('o\'tkazildi:', nega || '-');
  process.exit(0);
}

function statOrNull(p) {
  try {
    return fs.statSync(p);
  } catch (e) {
    return null;
  }
}

/** `git ... push ...` buyrug'ini aniqlash (&&, ;, | bilan ajratilgan qismlar ichida ham). */
function isGitPush(command) {
  if (!command || typeof command !== 'string') return false;
  for (const segment of command.split(/&&|\|\||;|\||\n/)) {
    const tokens = segment.trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) continue;
    let i = 0;
    while (i < tokens.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[i])) i++;
    if (i >= tokens.length) continue;
    const base = path.basename(tokens[i].replace(/^["']|["']$/g, '')).toLowerCase();
    if (base !== 'git' && base !== 'git.exe') continue;
    if (tokens.slice(i + 1).some((t) => t === 'push')) return true;
  }
  return false;
}

/** progress.html sprint fayllaridan eskirganmi? */
function eskirganmi(root) {
  const html = statOrNull(path.join(root, 'progress.html'));
  if (!html) return 'progress.html umuman yo\'q';

  const dir = path.join(root, 'sprints');
  let fayllar = [];
  try {
    fayllar = fs.readdirSync(dir).filter((f) => /^SPRINT-\d+-.+\.md$/i.test(f));
  } catch (e) {
    return null; // sprintlar yo'q -> uxlash rejimi
  }
  if (!fayllar.length) return null;

  for (const f of fayllar) {
    const s = statOrNull(path.join(dir, f));
    if (s && s.mtimeMs > html.mtimeMs + 1000) return `${f} progress.html'dan yangiroq`;
  }
  return false;
}

function urinishSoni(f) {
  try {
    const raw = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (Date.now() - (raw.t || 0) > STATE_TTL_MS) return 0;
    return Number(raw.n) || 0;
  } catch (e) {
    return 0;
  }
}

function main() {
  let raw = '';
  try {
    raw = fs.readFileSync(0, 'utf8');
  } catch (e) {
    ok('stdin o\'qilmadi: ' + e.code);
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch (e) {
    ok('JSON buzuq');
  }

  if (!input || input.tool_name !== 'Bash') ok('Bash emas');
  if (!isGitPush(input.tool_input && input.tool_input.command)) ok('push emas');

  const root = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  dbg('root:', root);
  const sabab = eskirganmi(root);
  dbg('sabab:', JSON.stringify(sabab));
  if (sabab === null || sabab === false) ok('progress.html dolzarb yoki sprintlar yo\'q');

  const stateDir = path.join(root, '.vibecoding');
  const stateFile = path.join(stateDir, 'push-urinish.json');

  const n = urinishSoni(stateFile) + 1;
  if (n > MAX_DENY) {
    try {
      fs.unlinkSync(stateFile);
    } catch (e) {
      /* jim */
    }
    ok();
  }

  try {
    if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });
    fs.writeFileSync(stateFile, JSON.stringify({ n: n, t: Date.now() }));
  } catch (e) {
    /* jim */
  }

  process.stderr.write(
    [
      '[Kalori · hisobotchi] Push to\'xtatildi — progress.html eskirgan.',
      `Sabab: ${sabab}.`,
      '',
      '`hisobotchi` agentini ishga tushiring (Agent tool, subagent_type: "hisobotchi")',
      'yoki `/hisobot` buyrug\'ini bering.',
      '',
      'Agentsiz tuzatmoqchi bo\'lsangiz, shunchaki quyidagini bajaring:',
      '  node scripts/progress.mjs',
      'keyin progress.html ni commit qiling va pushni qaytaring.',
    ].join('\n') + '\n'
  );
  process.exit(2);
}

try {
  main();
} catch (e) {
  ok();
}
