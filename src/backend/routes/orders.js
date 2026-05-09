const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const {
  createOrder,
  findActiveOrderByTable,
  listOrders,
  updateOrder,
} = require("../services/demoStore");

router.post("/", async (req, res) => {
  const { masa_id, urunler } = req.body;
  const client = await pool.connect().catch(() => null);
  const toplamTutar = (urunler || []).reduce(
    (sum, item) => sum + Number(item.fiyat || 0) * Number(item.miktar || 0),
    0
  );

  if (!client) {
    const yeniSiparis = createOrder({ masa_id, urunler });
    return res.status(201).json({ message: "Siparis basariyla olusturuldu", siparisId: yeniSiparis.id });
  }

  try {
    await client.query("BEGIN");

    const siparisResult = await client.query(
      "INSERT INTO siparisler (masa_id, durum, toplam_tutar) VALUES ($1, $2, $3) RETURNING id",
      [masa_id, "bekliyor", toplamTutar]
    );
    const siparisId = siparisResult.rows[0].id;

    for (const urun of urunler) {
      await client.query(
        "INSERT INTO siparis_kalemleri (siparis_id, urun_id, miktar, fiyat) VALUES ($1, $2, $3, $4)",
        [siparisId, urun.id, urun.miktar, urun.fiyat]
      );
    }

    await client.query("UPDATE masalar SET durum = $1 WHERE id = $2", ["dolu", masa_id]);
    await client.query("COMMIT");
    res.status(201).json({ message: "Siparis basariyla olusturuldu", siparisId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.warn("Orders API fallback olusturma kullandi:", err.message);
    const yeniSiparis = createOrder({ masa_id, urunler });
    res.status(201).json({ message: "Siparis basariyla olusturuldu", siparisId: yeniSiparis.id });
  } finally {
    client.release();
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
          s.*,
          m.masa_no,
          COALESCE(
            json_agg(
              json_build_object(
                'urun_adi', u.ad,
                'miktar', sk.miktar,
                'fiyat', sk.fiyat
              )
            ) FILTER (WHERE sk.id IS NOT NULL),
            '[]'::json
          ) AS kalemler
        FROM siparisler s
        LEFT JOIN masalar m ON m.id = s.masa_id
        LEFT JOIN siparis_kalemleri sk ON sk.siparis_id = s.id
        LEFT JOIN urunler u ON u.id = sk.urun_id
        WHERE s.durum NOT IN ('kapali', 'iptal')
        GROUP BY s.id, m.masa_no
        ORDER BY s.olusturma_tarihi ASC
      `
    );

    res.json(
      result.rows.map((row) => ({
        ...row,
        olusturma_zamani: row.olusturma_tarihi,
        urunler: row.kalemler,
      }))
    );
  } catch (err) {
    console.warn("Orders API fallback listeleme kullandi:", err.message);
    res.json(listOrders().filter((siparis) => siparis.durum !== "kapali" && siparis.durum !== "iptal"));
  }
});

router.get("/masa/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT
          s.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', u.id,
                'ad', u.ad,
                'miktar', sk.miktar,
                'fiyat', sk.fiyat,
                'tutar', sk.miktar * sk.fiyat
              )
            ) FILTER (WHERE sk.id IS NOT NULL),
            '[]'::json
          ) AS urunler
        FROM siparisler s
        LEFT JOIN siparis_kalemleri sk ON sk.siparis_id = s.id
        LEFT JOIN urunler u ON u.id = sk.urun_id
        WHERE s.masa_id = $1 AND s.durum NOT IN ('kapali', 'iptal')
        GROUP BY s.id
        ORDER BY s.olusturma_tarihi DESC
        LIMIT 1
      `,
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Aktif siparis bulunamadi." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.warn("Orders API fallback masa detayi kullandi:", err.message);
    const siparis = findActiveOrderByTable(id);

    if (!siparis) {
      return res.status(404).json({ error: "Aktif siparis bulunamadi." });
    }

    res.json(listOrders().find((item) => String(item.id) === String(siparis.id)));
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { durum } = req.body;

  try {
    const result = await pool.query(
      "UPDATE siparisler SET durum = $1 WHERE id = $2 RETURNING *",
      [durum, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.warn("Orders API fallback guncelleme kullandi:", err.message);
    const guncelSiparis = updateOrder(id, { durum });

    if (!guncelSiparis) {
      return res.status(404).json({ error: "Siparis bulunamadi." });
    }

    res.json(guncelSiparis);
  }
});

module.exports = router;
