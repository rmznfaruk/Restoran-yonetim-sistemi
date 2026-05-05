const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Yeni Ödeme Alma ve Siparişi Kapatma
router.post('/', async (req, res) => {
    const { siparis_id, tutar, odeme_yontemi, masa_id } = req.body;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // İşlemi başlat

        // 1. Ödemeler tablosuna kaydı ekle
        const odemeResult = await client.query(
            'INSERT INTO odemeler (siparis_id, tutar, odeme_yontemi) VALUES ($1, $2, $3) RETURNING *',
            [siparis_id, tutar, odeme_yontemi]
        );

        // 2. Siparişin durumunu 'kapali' yap
        await client.query(
            "UPDATE siparisler SET durum = 'kapali' WHERE id = $1",
            [siparis_id]
        );

        // 3. Masanın durumunu 'temizleniyor' yap (veya tercihe göre 'bos')
        if (masa_id) {
            await client.query(
                "UPDATE masalar SET durum = 'temizleniyor' WHERE id = $1",
                [masa_id]
            );
        }

        await client.query('COMMIT'); // Hata yoksa her şeyi onayla
        res.status(201).json({ message: 'Ödeme başarıyla alındı', odeme: odemeResult.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK'); // Hata varsa hiçbir şeyi kaydetme
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Tüm Ödemeleri Listeleme (Günün Sonu Raporu veya Yönetici Ekranı için)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM odemeler ORDER BY odeme_tarihi DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;