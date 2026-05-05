// src/backend/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const authMiddleware = require('../middleware/authMiddleware');

// Tüm rotalarda giriş yapılmış olması ve yönetici rolü gereklidir
router.use(authMiddleware);

// GET /api/users - Tüm personeli listele (şifre hash'i hariç)
router.get('/', async (req, res) => {
    try {
        // Sadece yöneticiler erişebilir
        if (req.kullanici.rol !== 'yonetici') {
            return res.status(403).json({ mesaj: 'Bu işlem için yetkiniz yok.' });
        }

        const result = await pool.query(
            'SELECT id, ad_soyad, kullanici_adi, rol, aktif_mi FROM personel ORDER BY id ASC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ mesaj: 'Sunucu hatası' });
    }
});

// POST /api/users - Yeni kullanıcı oluştur
router.post('/', async (req, res) => {
    try {
        if (req.kullanici.rol !== 'yonetici') {
            return res.status(403).json({ mesaj: 'Bu işlem için yetkiniz yok.' });
        }

        const { ad_soyad, kullanici_adi, sifre, rol } = req.body;

        // Şifreyi BCrypt ile hashle
        const salt = await bcrypt.genSalt(10);
        const sifre_hash = await bcrypt.hash(sifre, salt);

        const result = await pool.query(
            'INSERT INTO personel (ad_soyad, kullanici_adi, sifre_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, ad_soyad, kullanici_adi, rol, aktif_mi',
            [ad_soyad, kullanici_adi, sifre_hash, rol]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ mesaj: 'Kullanıcı eklenirken hata oluştu' });
    }
});

// PATCH /api/users/:id - Kullanıcı güncelle
router.patch('/:id', async (req, res) => {
    try {
        if (req.kullanici.rol !== 'yonetici') {
            return res.status(403).json({ mesaj: 'Bu işlem için yetkiniz yok.' });
        }

        const { id } = req.params;
        const { ad_soyad, rol, aktif_mi } = req.body;

        const result = await pool.query(
            'UPDATE personel SET ad_soyad = COALESCE($1, ad_soyad), rol = COALESCE($2, rol), aktif_mi = COALESCE($3, aktif_mi) WHERE id = $4 RETURNING id, ad_soyad, kullanici_adi, rol, aktif_mi',
            [ad_soyad, rol, aktif_mi, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mesaj: 'Kullanıcı bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ mesaj: 'Kullanıcı güncellenirken hata oluştu' });
    }
});

module.exports = router;