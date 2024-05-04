const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

dotenv.config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'chrimage1/',
    database: 'lcs48',
});

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Session middleware
app.use(session({
    secret: 'secret', // Change this to a more secure secret key
    resave: true,
    saveUninitialized: true
}));

// Middleware for authentication
const authenticateUser = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/');
    }
};

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Login route
app.post('/', (req, res) => {
    const { username, password } = req.body;

    connection.query("SELECT * FROM loginuser WHERE user_name = ? AND user_pass = ?", [username, password], (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
            req.session.authenticated = true;
            res.redirect('/home');
        } else {
            res.redirect('/');
        }
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
