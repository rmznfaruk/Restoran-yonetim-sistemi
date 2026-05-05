require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const tablesRouter = require('./routes/tables');
app.use('/api/tables', tablesRouter); //Yusuf ekledi

// Temel Middleware'ler
app.use(cors());
app.use(express.json());

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Rotaları içe aktar
const authRoutes = require('./routes/auth'); // YENİ EKLENEN SATIR

const app = express();

app.use(cors());
app.use(express.json());

// Rotaları kullan
app.use('/api/auth', authRoutes); // YENİ EKLENEN SATIR

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`RYS Backend sunucusu ${PORT} portunda çalışıyor...`);
});

module.exports = app;

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`RYS Backend sunucusu ${PORT} portunda çalışıyor...`);
});

module.exports = app;

app.use('/api/orders', require('./routes/orders')); //Yusuf ekledi