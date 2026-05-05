const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// 1. Tüm Kategorileri Listeleme (Serdar'ın sol menüsü için)
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM kategoriler ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Belirli Bir Kategorinin Ürünlerini Listeleme
router.get('/', async (req, res) => {
    const { kategoriId } = req.query;
    try {
        let query = 'SELECT * FROM urunler';
        let params = [];
        
        if (kategoriId) {
            query += ' WHERE kategori_id = $1';
            params.push(kategoriId);
        }
        query += ' ORDER BY id ASC';
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Ürün Bilgilerini (Ad, Fiyat, Açıklama, Mevcut) Güncelleme
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { ad, fiyat, mevcut } = req.body;
    try {
        const result = await pool.query(
            'UPDATE urunler SET ad = COALESCE($1, ad), fiyat = COALESCE($2, fiyat), mevcut = COALESCE($3, mevcut) WHERE id = $4 RETURNING *',
            [ad, fiyat, mevcut, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Stok Güncelleme
router.patch('/:id/stok', async (req, res) => {
    const { id } = req.params;
    const { stok_miktar } = req.body;
    try {
        const result = await pool.query(
            'UPDATE urunler SET stok_miktar = $1 WHERE id = $2 RETURNING *',
            [stok_miktar, id]
        );
        // Not: Email uyarısı kısmı (emailService) Hafta 10 görevinde buraya eklenecek.
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;