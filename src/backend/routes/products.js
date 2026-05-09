const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { sendStockAlert } = require("../services/emailService");
const {
  createProduct,
  deleteProduct,
  listCategories,
  listProducts,
  updateProduct,
  updateProductStock,
} = require("../services/demoStore");

const varsayilanKritikSeviye = 10;

async function kategoriBulVeyaOlustur(kategoriAdi) {
  if (!kategoriAdi) {
    return null;
  }

  const mevcutKategori = await pool.query(
    "SELECT id, ad FROM kategoriler WHERE LOWER(ad) = LOWER($1) LIMIT 1",
    [kategoriAdi]
  );

  if (mevcutKategori.rows[0]) {
    return mevcutKategori.rows[0];
  }

  const yeniKategori = await pool.query(
    "INSERT INTO kategoriler (ad) VALUES ($1) RETURNING id, ad",
    [kategoriAdi]
  );

  return yeniKategori.rows[0];
}

function urunSatiriBicimlendir(urun) {
  return {
    ...urun,
    kategori: urun.kategori || urun.kategori_adi || null,
    kategori_adi: urun.kategori_adi || urun.kategori || null,
    stok: Number(urun.stok ?? urun.stok_miktar ?? 0),
    stok_miktar: Number(urun.stok_miktar ?? urun.stok ?? 0),
    kritik_seviye: Number(urun.kritik_seviye ?? varsayilanKritikSeviye),
    kritikSeviye: Number(urun.kritikSeviye ?? urun.kritik_seviye ?? varsayilanKritikSeviye),
    fiyat: Number(urun.fiyat ?? 0),
  };
}

router.get("/categories", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kategoriler ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.warn("Products API fallback kategori listeleme kullandi:", err.message);
    res.json(listCategories());
  }
});

router.get("/", async (req, res) => {
  const { kategoriId } = req.query;

  try {
    let query = `
      SELECT
        u.*,
        k.ad AS kategori,
        k.ad AS kategori_adi
      FROM urunler u
      LEFT JOIN kategoriler k ON k.id = u.kategori_id
    `;
    const params = [];

    if (kategoriId) {
      query += " WHERE u.kategori_id = $1";
      params.push(kategoriId);
    }

    query += " ORDER BY u.id ASC";

    const result = await pool.query(query, params);
    res.json(result.rows.map(urunSatiriBicimlendir));
  } catch (err) {
    console.warn("Products API fallback urun listeleme kullandi:", err.message);
    res.json(listProducts({ kategoriId }).map(urunSatiriBicimlendir));
  }
});

router.post("/", async (req, res) => {
  const {
    ad,
    fiyat,
    kategori,
    kategori_id: kategoriIdGelen,
    stok,
    stok_miktar: stokMiktarGelen,
    kritik_seviye: kritikSeviyeGelen,
    mevcut,
  } = req.body;

  if (!ad || fiyat === undefined || fiyat === null) {
    return res.status(400).json({ error: "ad ve fiyat alanlari zorunludur." });
  }

  try {
    let kategoriId = kategoriIdGelen || null;

    if (!kategoriId && kategori) {
      const kategoriKaydi = await kategoriBulVeyaOlustur(kategori);
      kategoriId = kategoriKaydi?.id || null;
    }

    const stokMiktar = Number(stokMiktarGelen ?? stok ?? 0);
    const kritikSeviye = Number(kritikSeviyeGelen ?? varsayilanKritikSeviye);

    const result = await pool.query(
      `
        INSERT INTO urunler (kategori_id, ad, fiyat, stok_miktar, kritik_seviye, mevcut)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [kategoriId, ad, Number(fiyat), stokMiktar, kritikSeviye, mevcut !== false]
    );

    const yeniUrun = result.rows[0];
    let kategoriAdi = kategori || null;

    if (!kategoriAdi && kategoriId) {
      const kategoriSonuc = await pool.query("SELECT ad FROM kategoriler WHERE id = $1", [kategoriId]);
      kategoriAdi = kategoriSonuc.rows[0]?.ad || null;
    }

    res.status(201).json(
      urunSatiriBicimlendir({
        ...yeniUrun,
        kategori: kategoriAdi,
        kategori_adi: kategoriAdi,
      })
    );
  } catch (err) {
    console.warn("Products API fallback urun ekleme kullandi:", err.message);
    const yeniUrun = createProduct({
      ad,
      fiyat,
      kategori,
      kategori_id: kategoriIdGelen,
      stok,
      stok_miktar: stokMiktarGelen,
      kritik_seviye: kritikSeviyeGelen,
      mevcut,
    });
    res.status(201).json(urunSatiriBicimlendir(yeniUrun));
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    ad,
    fiyat,
    kategori,
    kategori_id: kategoriIdGelen,
    stok,
    stok_miktar: stokMiktarGelen,
    kritik_seviye: kritikSeviyeGelen,
    mevcut,
  } = req.body;

  try {
    let kategoriId = kategoriIdGelen || null;

    if (!kategoriId && kategori) {
      const kategoriKaydi = await kategoriBulVeyaOlustur(kategori);
      kategoriId = kategoriKaydi?.id || null;
    }

    const stokMiktar = stokMiktarGelen ?? stok;

    const result = await pool.query(
      `
        UPDATE urunler
        SET
          ad = COALESCE($1, ad),
          fiyat = COALESCE($2, fiyat),
          mevcut = COALESCE($3, mevcut),
          kategori_id = COALESCE($4, kategori_id),
          stok_miktar = COALESCE($5, stok_miktar),
          kritik_seviye = COALESCE($6, kritik_seviye)
        WHERE id = $7
        RETURNING *
      `,
      [
        ad,
        fiyat === undefined ? null : Number(fiyat),
        mevcut,
        kategoriId,
        stokMiktar === undefined ? null : Number(stokMiktar),
        kritikSeviyeGelen === undefined ? null : Number(kritikSeviyeGelen),
        id,
      ]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Urun bulunamadi." });
    }

    let kategoriAdi = kategori || null;

    if (!kategoriAdi && result.rows[0].kategori_id) {
      const kategoriSonuc = await pool.query("SELECT ad FROM kategoriler WHERE id = $1", [
        result.rows[0].kategori_id,
      ]);
      kategoriAdi = kategoriSonuc.rows[0]?.ad || null;
    }

    res.json(
      urunSatiriBicimlendir({
        ...result.rows[0],
        kategori: kategoriAdi,
        kategori_adi: kategoriAdi,
      })
    );
  } catch (err) {
    console.warn("Products API fallback urun guncelleme kullandi:", err.message);
    const guncelUrun = updateProduct(id, {
      ad,
      fiyat,
      kategori,
      kategori_id: kategoriIdGelen,
      stok,
      stok_miktar: stokMiktarGelen,
      kritik_seviye: kritikSeviyeGelen,
      mevcut,
    });

    if (!guncelUrun) {
      return res.status(404).json({ error: "Urun bulunamadi." });
    }

    res.json(urunSatiriBicimlendir(guncelUrun));
  }
});

router.patch("/:id/stok", async (req, res) => {
  const { id } = req.params;
  const { stok_miktar } = req.body;

  try {
    const result = await pool.query(
      "UPDATE urunler SET stok_miktar = $1 WHERE id = $2 RETURNING *",
      [stok_miktar, id]
    );

    const guncelUrun = result.rows[0];

    if (guncelUrun?.stok_miktar <= guncelUrun?.kritik_seviye) {
      sendStockAlert(guncelUrun.ad, guncelUrun.stok_miktar);
    }

    res.json(urunSatiriBicimlendir(guncelUrun));
  } catch (err) {
    console.warn("Products API fallback stok guncelleme kullandi:", err.message);
    const guncelUrun = updateProductStock(id, stok_miktar);

    if (!guncelUrun) {
      return res.status(404).json({ error: "Urun bulunamadi." });
    }

    if (guncelUrun.stok_miktar <= guncelUrun.kritik_seviye) {
      sendStockAlert(guncelUrun.ad, guncelUrun.stok_miktar);
    }

    res.json(urunSatiriBicimlendir(guncelUrun));
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM urunler WHERE id = $1 RETURNING *", [id]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Urun bulunamadi." });
    }

    res.json({ mesaj: "Urun silindi.", urun: result.rows[0] });
  } catch (err) {
    console.warn("Products API fallback urun silme kullandi:", err.message);
    const silinenUrun = deleteProduct(id);

    if (!silinenUrun) {
      return res.status(404).json({ error: "Urun bulunamadi." });
    }

    res.json({ mesaj: "Urun silindi.", urun: urunSatiriBicimlendir(silinenUrun) });
  }
});

module.exports = router;
