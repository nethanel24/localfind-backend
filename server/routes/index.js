const express = require('express');
const router = express.Router();
const path = require('path');

// Homepage
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../screens/index.html'));
});

module.exports = router;