const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { createTable, listTables, updateTable } = require("../services/demoStore");

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM masalar ORDER BY masa_no ASC");
    res.json(result.rows);
  } catch (err) {
    console.warn("Tables API fallback kullandi:", err.message);
    res.json(listTables());
  }
});

router.post("/", async (req, res) => {
  const { masa_no, kapasite, durum = "bos" } = req.body;

  if (!masa_no || !kapasite) {
    return res.status(400).json({ error: "masa_no ve kapasite zorunludur." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO masalar (masa_no, durum, kapasite) VALUES ($1, $2, $3) RETURNING *",
      [Number(masa_no), durum, Number(kapasite)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.warn("Tables API fallback ekleme kullandi:", err.message);

    const mevcutMasa = listTables().find((masa) => String(masa.masa_no) === String(masa_no));
    if (mevcutMasa) {
      return res.status(409).json({ error: "Bu masa numarasi zaten kayitli." });
    }

    const yeniMasa = createTable({ masa_no, kapasite, durum });
    res.status(201).json(yeniMasa);
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
