const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const conversionHistoryRoutes = require('./routes/conversionHistoryRoutes');

app.use('/users', userRoutes);
app.use('/conversion-history', conversionHistoryRoutes);

module.exports = app;
