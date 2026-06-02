CREATE TABLE IF NOT EXISTS answer_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anonymous_hash TEXT NOT NULL,
  date_key TEXT NOT NULL,
  question_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS answer_events_once_per_day
  ON answer_events (anonymous_hash, date_key, question_id);

CREATE INDEX IF NOT EXISTS answer_events_question_lookup
  ON answer_events (date_key, question_id, option_id);

CREATE TABLE IF NOT EXISTS tallies (
  date_key TEXT NOT NULL,
  question_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (date_key, question_id, option_id)
);

CREATE TABLE IF NOT EXISTS shares (
  token TEXT PRIMARY KEY,
  date_key TEXT NOT NULL,
  question_ids_json TEXT NOT NULL,
  answers_json TEXT NOT NULL,
  profile_json TEXT NOT NULL,
  verdict TEXT NOT NULL,
  rarity INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS shares_expires_at
  ON shares (expires_at);

CREATE TABLE IF NOT EXISTS waitlist (
  email TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'web',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
