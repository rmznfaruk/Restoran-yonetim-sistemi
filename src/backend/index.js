const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Hüseyin için Masa Planı Taslak API'si
app.get('/api/tables', (req, res) => {
    res.json([
        { id: 1, table_number: 1, status: 'bos' },
        { id: 2, table_number: 2, status: 'dolu' },
        { id: 3, table_number: 3, status: 'rezerve' }
    ]);
});

// Hüseyin için Sipariş Ekranı Taslak API'si
app.get('/api/products', (req, res) => {
    res.json([
        { id: 1, name: 'Adana Kebap', price: 250, category: 'Ana Yemek' },
        { id: 2, name: 'Kola', price: 40, category: 'İçecek' }
    ]);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`RYS Backend sunucusu ${PORT} portunda çalışıyor...`);
});