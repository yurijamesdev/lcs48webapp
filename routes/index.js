const express = require('express');
const router = express.Router();
const path = require('path');

const { authenticateUser } = require('../app');

// GET request for the login page
router.get('/', (req, res) => {
    // Render the login.html file from the views directory
    res.sendFile('login.html', { root: path.join(__dirname, '../views') });
});

// GET request for the executives homepage (requires authentication)
router.get('/home', authenticateUser, (req, res) => {
    // Render the home_admin.html file from the views directory
    res.sendFile('home_admin.html', { root: path.join(__dirname, '../views') });
});

// GET request for the executives my projects (requires authentication)
router.get('/myprojects', authenticateUser, (req, res) => {
    // Render the myprojects.html file from the views directory
    res.sendFile('myprojects.html', { root: path.join(__dirname, '../views') });
});

// GET request for the executives project (requires authentication)
router.get('/task', authenticateUser, (req, res) => {
    // Render the incomplete_task.html file from the views directory
    res.sendFile('incomplete_task.html', { root: path.join(__dirname, '../views') });
});

// GET request for the executives new project (requires authentication)
router.get('/newproject', authenticateUser, (req, res) => {
    // Render the newproject.html file from the views directory
    res.sendFile('newproject.html', { root: path.join(__dirname, '../views') });
});

// GET request for the executives all projects (requires authentication)
router.get('/allprojects', authenticateUser, (req, res) => {
    // Render the allprojects.html file from the views directory
    res.sendFile('allprojects.html', { root: path.join(__dirname, '../views') });
});

// GET request for the executives chat panel (requires authentication)
router.get('/chat', authenticateUser, (req, res) => {
    // Render the chat.html file from the views directory
    res.sendFile('chat.html', { root: path.join(__dirname, '../views') });
});

module.exports = router;
