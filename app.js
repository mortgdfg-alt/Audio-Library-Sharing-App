const errorHandler = require("./middleware/errorHandler.js");
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');
const app = express();

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/admin', adminRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

app.get("/error", (req, res) => {
  throw new Error("Something went wrong!");
});


app.use(errorHandler);

module.exports = app;
