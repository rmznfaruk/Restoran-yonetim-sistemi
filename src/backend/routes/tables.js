const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Veritabanı bağlantısı [cite: 152]

// Tüm masaları listeleme (Hüseyin'in Masa Planı ekranı için) [cite: 135, 154]
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM masalar ORDER BY masa_no ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Masa durumu güncelleme (Örn: Boş -> Dolu) 
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { durum } = req.body;
    try {
        const result = await pool.query(
            'UPDATE masalar SET durum = $1 WHERE id = $2 RETURNING *',
            [durum, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;