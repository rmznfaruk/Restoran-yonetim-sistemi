const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createFallbackUser,
  findFallbackUserByUsername,
  listFallbackUsers,
  updateFallbackUser,
} = require("../services/userStore");

const router = express.Router();

const yoneticiKontrolu = (req, res) => {
  if (req.kullanici?.rol !== "yonetici") {
    res.status(403).json({ mesaj: "Bu islem icin yonetici yetkisi gerekir." });
    return false;
  }

  return true;
};

router.post("/register", async (req, res) => {
  try {
    const { ad_soyad, kullanici_adi, sifre, rol } = req.body;
    const izinliRol = ["garson", "kasiyer", "mutfak"].includes(rol) ? rol : "garson";

    if (!ad_soyad || !kullanici_adi || !sifre) {
      return res.status(400).json({ mesaj: "Ad soyad, kullanici adi ve sifre zorunludur." });
    }

    if (findFallbackUserByUsername(kullanici_adi)) {
      return res.status(409).json({ mesaj: "Bu kullanici adi zaten kullanimda." });
    }

    try {
      const mevcutKullanici = await pool.query(
        "SELECT id FROM personel WHERE kullanici_adi = $1",
        [kullanici_adi]
      );

      if (mevcutKullanici.rows.length > 0) {
        return res.status(409).json({ mesaj: "Bu kullanici adi zaten kullanimda." });
      }

      const sifre_hash = await bcrypt.hash(sifre, 10);
      const result = await pool.query(
        "INSERT INTO personel (ad_soyad, kullanici_adi, sifre_hash, rol, aktif_mi) VALUES ($1, $2, $3, $4, $5) RETURNING id, ad_soyad, kullanici_adi, rol, aktif_mi",
        [ad_soyad, kullanici_adi, sifre_hash, izinliRol, true]
      );

      return res.status(201).json({
        mesaj: "Kullanici hesabi olusturuldu. Giris yapabilirsiniz.",
        kullanici: result.rows[0],
      });
    } catch (dbError) {
      const yeniKullanici = await createFallbackUser({
        ad_soyad,
        kullanici_adi,
        sifre,
        rol: izinliRol,
        aktif_mi: true,
      });

      console.warn("Public register fallback kullandi:", dbError.message);
      return res.status(201).json({
        mesaj: "Kullanici hesabi olusturuldu. Giris yapabilirsiniz.",
        kullanici: yeniKullanici,
      });
    }
  } catch (error) {
    return res.status(500).json({ mesaj: "Kullanici olusturulurken hata olustu." });
  }
});

router.use(authMiddleware);

router.get("/", async (req, res) => {
  if (!yoneticiKontrolu(req, res)) {
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, ad_soyad, kullanici_adi, rol, aktif_mi FROM personel ORDER BY id ASC"
    );
    return res.json(result.rows);
  } catch (error) {
    console.warn("Users API ornek veri ile yanit veriyor:", error.message);
    return res.json(listFallbackUsers());
  }
});

router.post("/", async (req, res) => {
  if (!yoneticiKontrolu(req, res)) {
    return;
  }

  try {
    const { ad_soyad, kullanici_adi, sifre, rol } = req.body;

    if (!ad_soyad || !kullanici_adi || !sifre || !rol) {
      return res.status(400).json({ mesaj: "Tum alanlar zorunludur." });
    }

    const sifre_hash = await bcrypt.hash(sifre, 10);

    try {
      const result = await pool.query(
        "INSERT INTO personel (ad_soyad, kullanici_adi, sifre_hash, rol, aktif_mi) VALUES ($1, $2, $3, $4, $5) RETURNING id, ad_soyad, kullanici_adi, rol, aktif_mi",
        [ad_soyad, kullanici_adi, sifre_hash, rol, true]
      );

      return res.status(201).json(result.rows[0]);
    } catch (dbError) {
      const yeniKullanici = await createFallbackUser({
        ad_soyad,
        kullanici_adi,
        sifre,
        rol,
        aktif_mi: true,
      });
      console.warn("Users API fallback ekleme kullandi:", dbError.message);
      return res.status(201).json(yeniKullanici);
    }
  } catch (error) {
    return res.status(500).json({ mesaj: "Kullanici eklenirken hata olustu." });
  }
});

router.patch("/:id", async (req, res) => {
  if (!yoneticiKontrolu(req, res)) {
    return;
  }

  try {
    const { id } = req.params;
    const { ad_soyad, rol, aktif_mi } = req.body;

    try {
      const result = await pool.query(
        "UPDATE personel SET ad_soyad = COALESCE($1, ad_soyad), rol = COALESCE($2, rol), aktif_mi = COALESCE($3, aktif_mi) WHERE id = $4 RETURNING id, ad_soyad, kullanici_adi, rol, aktif_mi",
        [ad_soyad, rol, aktif_mi, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ mesaj: "Kullanici bulunamadi." });
      }

      return res.json(result.rows[0]);
    } catch (dbError) {
      const guncelKullanici = updateFallbackUser(id, { ad_soyad, rol, aktif_mi });

      if (!guncelKullanici) {
        return res.status(404).json({ mesaj: "Kullanici bulunamadi." });
      }

      console.warn("Users API fallback guncelleme kullandi:", dbError.message);
      return res.json(guncelKullanici);
    }
  } catch (error) {
    return res.status(500).json({ mesaj: "Kullanici guncellenirken hata olustu." });
  }
});

module.exports = router;
