const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Genel Ciro ve Sipariş Özeti
router.get('/summary', async (req, res) => {
    try {
        // Toplam ciroyu hesapla
        const ciroResult = await pool.query('SELECT COALESCE(SUM(tutar), 0) as toplam_ciro FROM odemeler');
        // Toplam sipariş sayısını bul
        const siparisResult = await pool.query('SELECT COUNT(*) as toplam_siparis FROM siparisler');

        res.json({
            toplamCiro: parseFloat(ciroResult.rows[0].toplam_ciro),
            toplamSiparis: parseInt(siparisResult.rows[0].toplam_siparis)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;