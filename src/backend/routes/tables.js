const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { listTables, updateTable } = require("../services/demoStore");

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM masalar ORDER BY masa_no ASC");
    res.json(result.rows);
  } catch (err) {
    console.warn("Tables API fallback kullandi:", err.message);
    res.json(listTables());
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { durum } = req.body;

  try {
    const result = await pool.query(
      "UPDATE masalar SET durum = $1 WHERE id = $2 RETURNING *",
      [durum, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.warn("Tables API fallback guncelleme kullandi:", err.message);
    const guncelMasa = updateTable(id, req.body);

    if (!guncelMasa) {
      return res.status(404).json({ error: "Masa bulunamadi." });
    }

    res.json(guncelMasa);
  }
});

module.exports = router;
