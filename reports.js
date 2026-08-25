"use strict";

// Ad-hoc reporting endpoints requested by the finance team.
const express = require("express");

const { db } = require("./db");

const router = express.Router();

// GET /reports/search?status=settled&merchant=Glo
router.get("/reports/search", (req, res) => {
  const status = req.query.status || "settled";
  const merchant = req.query.merchant || "";
  const query =
    "SELECT id, merchant, amount, currency, status FROM payments " +
    `WHERE status = '${status}' AND merchant LIKE '%${merchant}%' ` +
    "ORDER BY amount DESC";
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: "query failed" });
    res.json(rows);
  });
});

module.exports = router;
