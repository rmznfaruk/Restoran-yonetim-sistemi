require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Temel middleware'ler
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.status(200).json({ durum: 'ok' });
});

// Rotalari ice aktar ve kullan
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const tablesRouter = require('./routes/tables');
app.use('/api/tables', tablesRouter);

const ordersRouter = require('./routes/orders');
app.use('/api/orders', ordersRouter);

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const paymentsRouter = require('./routes/payments');
app.use('/api/payments', paymentsRouter);

const reportsRouter = require('./routes/reports');
app.use('/api/reports', reportsRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`RYS Backend sunucusu ${PORT} portunda calisiyor...`);
});

module.exports = app;
