const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Yeni Sipariş Kaydetme
router.post('/', async (req, res) => {
    const { masa_id, urunler } = req.body; // urunler: [{id, miktar, fiyat}, ...]
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // İşlemi başlat
        
        // 1. Siparişler tablosuna ana kaydı ekle
        const siparisResult = await client.query(
            'INSERT INTO siparisler (masa_id, durum) VALUES ($1, $2) RETURNING id',
            [masa_id, 'bekliyor']
        );
        const siparisId = siparisResult.rows[0].id;

        // 2. Her bir ürünü siparis_kalemleri tablosuna ekle
        for (let urun of urunler) {
            await client.query(
                'INSERT INTO siparis_kalemleri (siparis_id, urun_id, miktar, fiyat) VALUES ($1, $2, $3, $4)',
                [siparisId, urun.id, urun.miktar, urun.fiyat]
            );
        }

        // 3. Masanın durumunu 'dolu' yap
        await client.query('UPDATE masalar SET durum = $1 WHERE id = $2', ['dolu', masa_id]);

        await client.query('COMMIT'); // Hata yoksa her şeyi onayla
        res.status(201).json({ message: 'Sipariş başarıyla oluşturuldu', siparisId });
    } catch (err) {
        await client.query('ROLLBACK'); // Hata varsa her şeyi geri al
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;