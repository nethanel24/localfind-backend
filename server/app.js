const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./middleware/logger');

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../screens')));

app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/authRoutes'));
module.exports = app;