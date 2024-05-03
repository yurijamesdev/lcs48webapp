// routes/index.js

const express = require('express');
const router = express.Router();

// GET request for the executives homepage
router.get('/', (req, res) => {
    // Render the index.html file from the views directory
    res.sendFile('home_admin.html', { root: 'views' });
});

// GET request for the login page
router.get('/login', (req, res) => {
    // Render the login.html file from the views directory
    res.sendFile('login.html', { root: 'views' });
});

// GET request for the executives my projects
router.get('/myprojects', (req, res) => {
    // Render the myprojects.html file from the views directory
    res.sendFile('myprojects.html', { root: 'views' });
});

// GET request for the executives new project
router.get('/newproject', (req, res) => {
    // Render the newproject.html file from the views directory
    res.sendFile('newproject.html', { root: 'views' });
});

// GET request for the executives new project
router.get('/allprojects', (req, res) => {
    // Render the allprojects.html file from the views directory
    res.sendFile('allprojects.html', { root: 'views' });
});

// GET request for the executives chat panel
router.get('/chat', (req, res) => {
    // Render the chat.html file from the views directory
    res.sendFile('chat.html', { root: 'views' });
});

module.exports = router;
