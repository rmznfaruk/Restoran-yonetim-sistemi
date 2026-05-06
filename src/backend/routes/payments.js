const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Yeni odeme al ve ilgili siparisi kapat
router.post('/', async (req, res) => {
    const { siparis_id, tutar, odeme_yontemi, masa_id } = req.body;

    if (!siparis_id || !tutar || !odeme_yontemi) {
        return res.status(400).json({ error: 'siparis_id, tutar ve odeme_yontemi zorunludur.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const odemeResult = await client.query(
            'INSERT INTO odemeler (siparis_id, tutar, odeme_yontemi) VALUES ($1, $2, $3) RETURNING *',
            [siparis_id, tutar, odeme_yontemi]
        );

        await client.query(
            "UPDATE siparisler SET durum = 'kapali', toplam_tutar = COALESCE(toplam_tutar, $2) WHERE id = $1",
            [siparis_id, tutar]
        );

        if (masa_id) {
            await client.query(
                "UPDATE masalar SET durum = 'temizleniyor' WHERE id = $1",
                [masa_id]
            );
        }

        await client.query('COMMIT');
        return res.status(201).json({
            message: 'Odeme basariyla alindi',
            odeme: odemeResult.rows[0],
        });
    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Tum odemeleri listele
router.get('/', async (_req, res) => {
    try {
        const result = await pool.query('SELECT * FROM odemeler ORDER BY odeme_tarihi DESC');
        return res.json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
