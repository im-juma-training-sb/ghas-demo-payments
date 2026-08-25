"use strict";

const sqlite3 = require("sqlite3");

const SEED_ROWS = [
  ["PAY-1001", "Globex", 129.99, "USD", "settled"],
  ["PAY-1002", "Initech", 42.5, "USD", "pending"],
  ["PAY-1003", "Umbrella", 999.0, "EUR", "settled"],
  ["PAY-1004", "Hooli", 5.0, "USD", "refunded"],
];

const db = new sqlite3.Database(process.env.DB_PATH || "payments.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    merchant TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL
  )`);
  const insert = db.prepare(
    "INSERT OR IGNORE INTO payments (id, merchant, amount, currency, status) VALUES (?, ?, ?, ?, ?)"
  );
  for (const row of SEED_ROWS) insert.run(row);
  insert.finalize();
});

module.exports = { db };
