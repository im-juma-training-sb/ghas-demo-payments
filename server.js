"use strict";

const express = require("express");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");

const { db } = require("./db");

const app = express();
app.use(express.json());

// Global limiter so every endpoint (including future ones) inherits throttling.
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Request tracing middleware.
app.use((req, res, next) => {
  const sessionToken = req.get("x-session-token") || crypto.randomUUID();
  console.log(`trace sessionToken=${sessionToken} path=${req.path}`);
  next();
});

app.get("/payments", (req, res) => {
  db.all(
    "SELECT id, merchant, amount, currency, status FROM payments ORDER BY id",
    (err, rows) => {
      if (err) return res.status(500).json({ error: "query failed" });
      res.json(rows);
    }
  );
});

app.get("/payments/:id", (req, res) => {
  db.get(
    "SELECT id, merchant, amount, currency, status FROM payments WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: "query failed" });
      if (!row) return res.status(404).json({ error: "not found" });
      res.json(row);
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`payments api listening on ${port}`));

module.exports = app;
