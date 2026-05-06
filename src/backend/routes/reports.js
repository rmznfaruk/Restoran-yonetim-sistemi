const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

const intervalMap = {
    gunluk: '1 day',
    haftalik: '7 days',
    aylik: '30 days',
};

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('tr-TR')} TL`;

router.get('/', async (req, res) => {
    const periyot = req.query.periyot || 'gunluk';
    const interval = intervalMap[periyot] || intervalMap.gunluk;

    try {
        const [ciroResult, siparisResult, urunResult] = await Promise.all([
            pool.query(
                `SELECT COALESCE(SUM(tutar), 0) AS toplam_ciro,
                        COALESCE(AVG(tutar), 0) AS ortalama_tutar
                 FROM odemeler
                 WHERE odeme_tarihi >= NOW() - $1::interval`,
                [interval]
            ),
            pool.query(
                `SELECT COUNT(*) AS toplam_siparis
                 FROM siparisler
                 WHERE olusturma_tarihi >= NOW() - $1::interval`,
                [interval]
            ),
            pool.query(
                `SELECT u.ad, COALESCE(SUM(sk.miktar), 0) AS adet
                 FROM siparis_kalemleri sk
                 JOIN urunler u ON u.id = sk.urun_id
                 JOIN siparisler s ON s.id = sk.siparis_id
                 WHERE s.olusturma_tarihi >= NOW() - $1::interval
                 GROUP BY u.id, u.ad
                 ORDER BY adet DESC, u.ad ASC
                 LIMIT 5`,
                [interval]
            ),
        ]);

        return res.json({
            toplamCiro: formatCurrency(ciroResult.rows[0].toplam_ciro),
            siparisSayisi: Number(siparisResult.rows[0].toplam_siparis || 0),
            ortalamaTutar: formatCurrency(ciroResult.rows[0].ortalama_tutar),
            enCokSatanlar: urunResult.rows.map((row) => ({
                ad: row.ad,
                adet: Number(row.adet || 0),
            })),
            personel: [],
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/summary', async (_req, res) => {
    try {
        const ciroResult = await pool.query('SELECT COALESCE(SUM(tutar), 0) AS toplam_ciro FROM odemeler');
        const siparisResult = await pool.query('SELECT COUNT(*) AS toplam_siparis FROM siparisler');

        return res.json({
            toplamCiro: Number(ciroResult.rows[0].toplam_ciro || 0),
            toplamSiparis: Number(siparisResult.rows[0].toplam_siparis || 0),
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
