const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { createPayment, findActiveOrderByTable, listPayments } = require("../services/demoStore");

const odemeYontemiEslesmeleri = {
  "kredi karti": "kart",
  kart: "kart",
  nakit: "nakit",
  mobil: "mobil",
};

const normalizeOdemeYontemi = (deger) => {
  const anahtar = String(deger || "").trim().toLowerCase();
  return odemeYontemiEslesmeleri[anahtar] || "kart";
};

router.post("/", async (req, res) => {
  const { siparis_id, tutar, odeme_yontemi, masa_id } = req.body;
  const client = await pool.connect().catch(() => null);

  const normalizedMethod = normalizeOdemeYontemi(odeme_yontemi);

  if (!client) {
    const odeme = createPayment({
      siparis_id,
      masa_id,
      odeme_yontemi: normalizedMethod,
      tutar,
    });

    if (!odeme) {
      return res.status(404).json({ error: "Odeme alinacak aktif siparis bulunamadi." });
    }

    return res.status(201).json({ message: "Odeme basariyla alindi", odeme });
  }

  try {
    await client.query("BEGIN");

    let siparisId = siparis_id;

    if (!siparisId && masa_id) {
      const siparisResult = await client.query(
        "SELECT id, toplam_tutar FROM siparisler WHERE masa_id = $1 AND durum NOT IN ('kapali', 'iptal') ORDER BY olusturma_tarihi DESC LIMIT 1",
        [masa_id]
      );

      siparisId = siparisResult.rows[0]?.id;
    }

    if (!siparisId || !tutar || !normalizedMethod) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "siparis_id veya masa_id ile birlikte tutar ve odeme_yontemi zorunludur." });
    }

    const odemeResult = await client.query(
      "INSERT INTO odemeler (siparis_id, tutar, odeme_yontemi) VALUES ($1, $2, $3) RETURNING *",
      [siparisId, tutar, normalizedMethod]
    );

    await client.query(
      "UPDATE siparisler SET durum = 'kapali', toplam_tutar = COALESCE(toplam_tutar, $2) WHERE id = $1",
      [siparisId, tutar]
    );

    if (masa_id) {
      await client.query("UPDATE masalar SET durum = 'temizleniyor' WHERE id = $1", [masa_id]);
    }

    await client.query("COMMIT");
    return res.status(201).json({ message: "Odeme basariyla alindi", odeme: odemeResult.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.warn("Payments API fallback kullandi:", err.message);

    const odeme = createPayment({
      siparis_id: siparis_id || findActiveOrderByTable(masa_id)?.id,
      masa_id,
      odeme_yontemi: normalizedMethod,
      tutar,
    });

    if (!odeme) {
      return res.status(404).json({ error: "Odeme alinacak aktif siparis bulunamadi." });
    }

    return res.status(201).json({ message: "Odeme basariyla alindi", odeme });
  } finally {
    client.release();
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM odemeler ORDER BY odeme_tarihi DESC");
    return res.json(result.rows);
  } catch (err) {
    console.warn("Payments API fallback listeleme kullandi:", err.message);
    return res.json(listPayments());
  }
});

module.exports = router;
