const express = require('express');
const router = express.Router();

// Create User
router.get('/todo', async (req, res) => {
  res.send('todo');
});

module.exports = router;
