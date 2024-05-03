// routes/index.js

const express = require('express');
const router = express.Router();

// GET request for the homepage
router.get('/', (req, res) => {
    // Render the index.html file from the views directory
    res.sendFile('home_admin.html', { root: 'views' });
});

module.exports = router;
