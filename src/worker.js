import { QUESTIONS, getQuestion, optionSeedCount } from "../public/assets/questions.js";

const ROUND_SIZE = 5;
const SHARE_TTL_DAYS = 30;
const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    try {
      if (url.pathname === "/api/health") {
        return json({ ok: true, service: "tellingly", db: Boolean(env.DB) });
      }
      if (url.pathname === "/api/today" && request.method === "GET") {
        return json(await getToday(env));
      }
      if (url.pathname === "/api/answer" && request.method === "POST") {
        return json(await recordAnswer(request, env));
      }
      if (url.pathname === "/api/share" && request.method === "POST") {
        return json(await createShare(request, env, url.origin));
      }
      if (url.pathname.startsWith("/api/share/") && request.method === "GET") {
        const token = url.pathname.split("/").pop();
        return json(await getShare(env, token));
      }
      if (url.pathname === "/api/waitlist" && request.method === "POST") {
        return json(await joinWaitlist(request, env));
      }
    } catch (error) {
      const status = error.status || 500;
      return json({ error: error.message || "Something went wrong" }, status);
    }

    return env.ASSETS.fetch(request);
  }
};

async function getToday(env) {
  const dateKey = todayKey();
  const deck = dailyDeck(dateKey);
  const distributions = await getDistributions(env, dateKey, deck.map((question) => question.id));
  return {
    dateKey,
    questions: deck.map((question) => toClientQuestion(question, distributions[question.id]))
  };
}

async function recordAnswer(request, env) {
  const body = await readJson(request);
  const dateKey = String(body.dateKey || todayKey()).slice(0, 10);
  const question = getQuestion(body.questionId);
  if (!question) throw httpError(400, "Unknown question");
  const option = question.options.find((row) => row.id === body.optionId);
  if (!option) throw httpError(400, "Unknown option");

  if (env.DB && body.anonymousId) {
    const anonymousHash = await hashAnonymousId(String(body.anonymousId), env.ANSWER_SALT || "tellingly-local-salt");
    const insert = await env.DB
      .prepare("INSERT OR IGNORE INTO answer_events (anonymous_hash, date_key, question_id, option_id) VALUES (?, ?, ?, ?)")
      .bind(anonymousHash, dateKey, question.id, option.id)
      .run();

    if (insert.meta?.changes) {
      await env.DB
        .prepare(`
          INSERT INTO tallies (date_key, question_id, option_id, count, updated_at)
          VALUES (?, ?, ?, 1, datetime('now'))
          ON CONFLICT(date_key, question_id, option_id)
          DO UPDATE SET count = count + 1, updated_at = datetime('now')
        `)
        .bind(dateKey, question.id, option.id)
        .run();
    }
  }

  const distributions = await getDistributions(env, dateKey, [question.id]);
  return {
    accepted: true,
    dateKey,
    distribution: distributions[question.id] || seedDistribution(question)
  };
}

async function createShare(request, env, origin) {
  if (!env.DB) throw httpError(503, "Database unavailable");
  const body = await readJson(request);
  const questionIds = Array.isArray(body.questionIds) ? body.questionIds.filter((id) => getQuestion(id)).slice(0, ROUND_SIZE) : [];
  const answers = Array.isArray(body.answers) ? body.answers.slice(0, ROUND_SIZE).map(safeAnswer) : [];
  if (!questionIds.length || !answers.length) throw httpError(400, "Missing answers");

  const token = randomToken();
  const dateKey = String(body.dateKey || todayKey()).slice(0, 10);
  const expiresAt = new Date(Date.now() + SHARE_TTL_DAYS * 86400000).toISOString();
  const rarity = clamp(parseInt(body.rarity, 10) || 50, 1, 99);
  const verdict = String(body.verdict || "You answer from instinct first and edit later.").slice(0, 160);
  const profile = sanitizeProfile(body.profile || {});

  await env.DB
    .prepare(`
      INSERT INTO shares (token, date_key, question_ids_json, answers_json, profile_json, verdict, rarity, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(token, dateKey, JSON.stringify(questionIds), JSON.stringify(answers), JSON.stringify(profile), verdict, rarity, expiresAt)
    .run();

  return {
    token,
    url: `${origin}/compare/${token}`,
    expiresAt
  };
}

async function getShare(env, token) {
  if (!env.DB) throw httpError(503, "Database unavailable");
  if (!/^[A-Za-z0-9_-]{10,32}$/.test(token || "")) throw httpError(400, "Invalid token");

  const row = await env.DB
    .prepare("SELECT * FROM shares WHERE token = ? AND expires_at > datetime('now')")
    .bind(token)
    .first();
  if (!row) throw httpError(404, "Share not found");

  return {
    share: {
      token: row.token,
      dateKey: row.date_key,
      questionIds: parseJson(row.question_ids_json, []),
      answers: parseJson(row.answers_json, []),
      profile: parseJson(row.profile_json, {}),
      verdict: row.verdict,
      rarity: row.rarity,
      createdAt: row.created_at,
      expiresAt: row.expires_at
    }
  };
}

async function joinWaitlist(request, env) {
  if (!env.DB) throw httpError(503, "Database unavailable");
  const body = await readJson(request);
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw httpError(400, "Invalid email");
  const source = String(body.source || "web").slice(0, 80);
  await env.DB
    .prepare("INSERT OR REPLACE INTO waitlist (email, source, created_at) VALUES (?, ?, datetime('now'))")
    .bind(email, source)
    .run();
  return { ok: true };
}

async function getDistributions(env, dateKey, questionIds) {
  const live = {};
  if (env.DB && questionIds.length) {
    const placeholders = questionIds.map(() => "?").join(", ");
    const rows = await env.DB
      .prepare(`SELECT question_id, option_id, count FROM tallies WHERE date_key = ? AND question_id IN (${placeholders})`)
      .bind(dateKey, ...questionIds)
      .all();
    for (const row of rows.results || []) {
      live[row.question_id] = live[row.question_id] || {};
      live[row.question_id][row.option_id] = row.count;
    }
  }

  return Object.fromEntries(questionIds.map((questionId) => {
    const question = getQuestion(questionId);
    return [questionId, question ? seedDistribution(question, live[questionId] || {}) : null];
  }));
}

function seedDistribution(question, liveCounts = {}) {
  const rows = question.options.map((option) => ({
    id: option.id,
    count: optionSeedCount(question, option) + (liveCounts[option.id] || 0)
  }));
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return {
    questionId: question.id,
    total,
    options: rows.map((row) => ({
      ...row,
      percent: Math.max(1, Math.round((row.count / total) * 100))
    }))
  };
}

function toClientQuestion(question, distribution) {
  return {
    id: question.id,
    question: question.question,
    seedN: question.seedN,
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text,
      seedPct: option.seedPct,
      trait: option.trait || ""
    })),
    distribution
  };
}

function dailyDeck(dateKey) {
  return shuffleWithSeed(QUESTIONS, hashNumber(dateKey)).slice(0, ROUND_SIZE);
}

function safeAnswer(answer) {
  return {
    questionId: String(answer.questionId || "").slice(0, 80),
    question: String(answer.question || "").slice(0, 240),
    optionId: String(answer.optionId || "").slice(0, 80),
    choice: String(answer.choice || "").slice(0, 160),
    percent: clamp(parseInt(answer.percent, 10) || 50, 1, 99),
    trait: String(answer.trait || "").slice(0, 40)
  };
}

function sanitizeProfile(profile) {
  const traits = {};
  const inputTraits = profile.traits || {};
  for (const [key, value] of Object.entries(inputTraits)) {
    traits[String(key).slice(0, 40)] = clamp(parseInt(value, 10) || 0, 0, 99);
  }
  return {
    topTrait: String(profile.topTrait || "").slice(0, 40),
    traits
  };
}

async function hashAnonymousId(value, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function shuffleWithSeed(items, seed) {
  const result = [...items];
  let value = seed;
  for (let index = result.length - 1; index > 0; index -= 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const swapIndex = value % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function hashNumber(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw httpError(400, "Invalid JSON");
  }
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...JSON_HEADERS, ...corsHeaders() }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
