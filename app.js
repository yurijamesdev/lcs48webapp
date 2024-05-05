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
app.post('/newproject', (req, res) => {
    const { projectName, task, dueDate, 'assign-to': assignedUser } = req.body;

    // Check if assignedUser is provided
    if (!assignedUser) {
        return res.status(400).json({ message: 'Please select a user to assign the project' });
    }

    // Assuming the "created_by" is the currently logged-in user, you can get it from the session
    const createdBy = req.session.username; // Update this based on your session implementation

    // Example SQL query to insert project into database with creation timestamp
    const insertQuery = `INSERT INTO projects (project_name, task, due_date, created_by, assigned_to, created_on) VALUES (?, ?, ?, ?, ?, NOW())`;

    // Execute the query with user inputs
    connection.query(insertQuery, [projectName, task, dueDate, createdBy, assignedUser], (error, results, fields) => {
        if (error) {
            console.error('Error creating project:', error);
            res.redirect('/newproject')
        } else {
            console.log('Project created successfully'); // Log message to console
            res.redirect('/myprojects');
        }
    });
});

// Route to fetch projects data from the database
app.get('/get_data', (req, res) => {
    const username = req.session.username; // Get the username from the session
    const fetchProjectsQuery = 'SELECT * FROM projects WHERE created_by = ? ORDER BY created_on DESC'; // Fetch projects by the logged-in user

    connection.query(fetchProjectsQuery, [username], (error, results, fields) => {
        if (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ message: 'Failed to fetch projects' });
        } else {
            res.json({ projects: results });
        }
    });
});

// Route to fetch all projects data from the database
app.get('/get_all_projects', (req, res) => {
    const fetchAllProjectsQuery = 'SELECT * FROM projects ORDER BY due_date ASC';

    connection.query(fetchAllProjectsQuery, (error, results, fields) => {
        if (error) {
            console.error('Error fetching all projects:', error);
            res.status(500).json({ message: 'Failed to fetch projects' });
        } else {
            res.json({ projects: results });
        }
    });
});


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

