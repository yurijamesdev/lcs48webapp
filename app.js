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

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Export authenticateUser middleware so it can be used in other files
module.exports = {
    app,
    authenticateUser
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
            req.session.username = username; // Save the username in the session
            res.redirect('/home');
        } else {
            res.redirect('/');
        }
    });
});

// Route to handle project creation
app.post('/newproject', (req, res) => {
    const { projectName, task, dueDate, 'assign-to': assignedUsers } = req.body;

    // Check if assignedUsers is an array
    if (!Array.isArray(assignedUsers)) {
        return res.status(400).json({ message: 'Assigned users must be an array' });
    }

    // Assuming the "created_by" is the currently logged-in user, you can get it from the session
    const createdBy = req.session.username; // Update this based on your session implementation

    // Example SQL query to insert project into database with creation timestamp
    const insertQuery = `INSERT INTO projects (project_name, task, due_date, created_by, assigned_to, created_on) VALUES (?, ?, ?, ?, ?, NOW())`;

    // Execute the query with user inputs
    connection.query(insertQuery, [projectName, task, dueDate, createdBy, assignedUsers.join(', ')], (error, results, fields) => {
        if (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Failed to create project' });
        } else {
            console.log('Project created successfully'); // Log message to console
            res.status(200).json({ message: 'Project created successfully' });
        }
    });
});

// Route to fetch projects data
app.get('/projects', (req, res) => {
    const fetchProjectsQuery = `SELECT * FROM projects`;

    connection.query(fetchProjectsQuery, (error, results, fields) => {
        if (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ message: 'Failed to fetch projects' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
