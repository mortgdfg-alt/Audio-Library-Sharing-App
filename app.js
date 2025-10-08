const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Mount admin routes under /admin
app.use('/admin', adminRoutes);

// Basic health
app.get('/', (req, res) => res.json({ ok: true }));

module.exports = app;
