require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Temel Middleware'ler
app.use(cors());
app.use(express.json());

// Rotalari ice aktar ve kullan
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const tablesRouter = require('./routes/tables');
app.use('/api/tables', tablesRouter);

const ordersRouter = require('./routes/orders');
app.use('/api/orders', ordersRouter);

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const paymentsRouter = require('./routes/payments');
app.use('/api/payments', paymentsRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`RYS Backend sunucusu ${PORT} portunda calisiyor...`);
});

module.exports = app;
