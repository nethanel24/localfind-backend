const express = require('express');
const router = express.Router();
const path = require('path');
const screens = path.join(__dirname, '../../screens');
// Homepage
router.get('/', (req, res) => {
  res.sendFile(path.join(screens, 'index.html'));
});
router.get('/login', (req, res) => {
  res.sendFile(path.join(screens, 'login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(screens, 'register.html'));
});

module.exports = router;