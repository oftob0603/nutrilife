#!/usr/bin/env node
/**
 * Nutrilife · "baza" MCP serveri (stdio)
 *
 * DATABASE_URL faqat loyiha ildizidagi .env'dan o'qiladi — parol bu faylda
 * ham, .mcp.json'da ham saqlanmaydi.
 *
 * Qoidalar (CLAUDE.md, "Baza" bo'limi):
 *   sorov         — SELECT erkin (faqat o'qish tranzaksiyasida), INSERT/UPDATE mumkin
 *   xavfli_sorov  — DELETE/DROP/TRUNCATE; faqat foydalanuvchi aniq ruxsat berganda.
 *                   .claude/settings.json bu vositani har safar so'rashga qo'yadi.
 * Boshqa buyruqlar (ALTER, CREATE, GRANT ...) rad etiladi — sxema Prisma
 * migratsiyalari orqali o'zgaradi.
 *
 * stdout faqat JSON-RPC uchun; loglar stderr'ga yoziladi.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = path.join(ROOT, '.env');
const MAX_ROWS = 200;

if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);

function log(...args) {
  process.stderr.write('[baza] ' + args.join(' ') + '\n');
}

// ---------------------------------------------------------------------------
// SQL tasnifi
// ---------------------------------------------------------------------------

/** Izohlar va satr/identifikator literallarini olib tashlaydi — kalit so'zlar faqat kodda qidiriladi. */
function stripSql(sql) {
  return sql
    .replace(/--[^\n]*/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\$([A-Za-z_]*)\$[\s\S]*?\$\1\$/g, ' ')
    .replace(/'(?:[^']|'')*'/g, ' ')
    .replace(/"(?:[^"]|"")*"/g, ' ');
}

/** @returns {'oqish' | 'yozish' | 'xavfli' | {xato: string}} */
function classify(sql) {
  const code = stripSql(sql).trim().replace(/;\s*$/, '');
  if (!code) return { xato: "So'rov bo'sh." };
  if (code.includes(';')) return { xato: "Bir so'rovda faqat bitta buyruq bo'lishi mumkin." };

  const upper = code.toUpperCase();
  if (/\b(DELETE|DROP|TRUNCATE)\b/.test(upper)) return 'xavfli';

  const first = upper.match(/^[A-Z]+/)?.[0];
  if (first === 'INSERT' || first === 'UPDATE') return 'yozish';
  // WITH ichida INSERT/UPDATE bo'lsa yozish; SELECT ... FOR UPDATE esa o'qish emas, lekin
  // o'qish tranzaksiyasi uni baribir rad etadi, shuning uchun yozish deb olinadi.
  if (first === 'WITH') return /\b(INSERT|UPDATE)\b/.test(upper) ? 'yozish' : 'oqish';
  if (['SELECT', 'EXPLAIN', 'SHOW', 'VALUES', 'TABLE'].includes(first)) {
    return /\bFOR\s+(UPDATE|SHARE|NO\s+KEY|KEY)\b/.test(upper) ? 'yozish' : 'oqish';
  }
  return { xato: `"${first ?? '?'}" buyrug'i ruxsat etilmagan. Sxema Prisma migratsiyalari orqali o'zgaradi.` };
}

// ---------------------------------------------------------------------------
// Baza
// ---------------------------------------------------------------------------

let pool = null;

function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error(".env'da DATABASE_URL yo'q — Railway PostgreSQL connection string'ini qo'shing.");
  if (!pool) {
    pool = new pg.Pool({ connectionString: url, max: 2 });
    pool.on('error', (e) => log('pool xatosi:', e.message));
  }
  return pool;
}

async function run(sql, tur) {
  const client = await getPool().connect();
  try {
    await client.query(tur === 'oqish' ? 'BEGIN READ ONLY' : 'BEGIN');
    const res = await client.query(sql);
    await client.query('COMMIT');
    const rows = res.rows ?? [];
    return {
      buyruq: res.command,
      tasirlangan_qatorlar: res.rowCount,
      qatorlar: rows.slice(0, MAX_ROWS),
      qisqartirildi: rows.length > MAX_ROWS,
    };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Vositalar
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: 'sorov',
    description:
      "PostgreSQL'da bitta SQL buyrug'ini bajaradi. SELECT (o'qish tranzaksiyasida), INSERT va UPDATE ruxsat etilgan. " +
      `Natijada ko'pi bilan ${MAX_ROWS} qator qaytadi. DELETE/DROP/TRUNCATE uchun xavfli_sorov ishlatiladi.`,
    inputSchema: {
      type: 'object',
      properties: { sql: { type: 'string', description: "Bitta SQL buyrug'i" } },
      required: ['sql'],
      additionalProperties: false,
    },
  },
  {
    name: 'xavfli_sorov',
    description:
      "DELETE, DROP yoki TRUNCATE buyrug'ini bajaradi. FAQAT foydalanuvchi chatda aynan shu amalga aniq ruxsat " +
      "berganda chaqiriladi. Chaqirishdan oldin nima o'chishini foydalanuvchiga ko'rsating.",
    inputSchema: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: "Bitta DELETE/DROP/TRUNCATE buyrug'i" },
        ruxsat: { type: 'string', description: "Foydalanuvchi bergan ruxsat matni (chatdan iqtibos)" },
      },
      required: ['sql', 'ruxsat'],
      additionalProperties: false,
    },
  },
];

async function callTool(name, args) {
  const sql = typeof args?.sql === 'string' ? args.sql : '';
  const tur = classify(sql);
  if (typeof tur === 'object') throw new Error(tur.xato);

  if (name === 'sorov') {
    if (tur === 'xavfli') throw new Error("DELETE/DROP/TRUNCATE bu vositada bajarilmaydi — aniq ruxsat bilan xavfli_sorov ishlatiladi.");
    return run(sql, tur);
  }
  if (name === 'xavfli_sorov') {
    if (tur !== 'xavfli') throw new Error("Bu vosita faqat DELETE/DROP/TRUNCATE uchun. Boshqa so'rovlar uchun sorov ishlatiladi.");
    if (!args?.ruxsat || !String(args.ruxsat).trim()) throw new Error("Foydalanuvchining aniq ruxsati ko'rsatilmagan.");
    log('xavfli so\'rov bajarilmoqda');
    return run(sql, tur);
  }
  throw new Error(`Noma'lum vosita: ${name}`);
}

// ---------------------------------------------------------------------------
// JSON-RPC (MCP stdio)
// ---------------------------------------------------------------------------

function send(msg) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');
}

async function handle(msg) {
  const { id, method, params } = msg;
  const isRequest = id !== undefined && id !== null;

  switch (method) {
    case 'initialize':
      return send({
        id,
        result: {
          protocolVersion: params?.protocolVersion ?? '2025-06-18',
          capabilities: { tools: {} },
          serverInfo: { name: 'baza', version: '0.1.0' },
        },
      });
    case 'ping':
      return send({ id, result: {} });
    case 'tools/list':
      return send({ id, result: { tools: TOOLS } });
    case 'tools/call':
      try {
        const data = await callTool(params?.name, params?.arguments);
        return send({ id, result: { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] } });
      } catch (e) {
        return send({ id, result: { isError: true, content: [{ type: 'text', text: e.message }] } });
      }
    default:
      if (isRequest) send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return send({ id: null, error: { code: -32700, message: 'Parse error' } });
  }
  handle(msg).catch((e) => log('kutilmagan xato:', e.message));
});
rl.on('close', async () => {
  if (pool) await pool.end().catch(() => {});
  process.exit(0);
});

log('tayyor');
