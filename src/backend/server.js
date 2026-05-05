require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Temel Middleware'ler
app.use(cors());
app.use(express.json());

// Rotaları içe aktar ve kullan
const authRoutes = require('./routes/auth'); // Ramazan'ın eklediği
app.use('/api/auth', authRoutes); 

const tablesRouter = require('./routes/tables'); // Yusuf'un eklediği
app.use('/api/tables', tablesRouter);

const ordersRouter = require('./routes/orders'); // Yusuf'un eklediği
app.use('/api/orders', ordersRouter);

const productsRouter = require('./routes/products'); // Yusuf'un eklediği
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`RYS Backend sunucusu ${PORT} portunda çalışıyor...`);
});

module.exports = app;