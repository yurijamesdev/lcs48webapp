const express = require('express');
const http = require('http');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'chrimage1/',
    database: 'project_manager',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

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

    connection.query("SELECT * FROM users WHERE user_name = ? AND user_pass = ?", [username, password], (error, results, fields) => {
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
    const { projectName, task, dueDate, 'assign-to': assignedUser, subProjectName, subTask, subDueDate, subAssignTo } = req.body;

    // Debugging: Log the received data
    console.log('Received Form Data:', req.body);

    if (!projectName) {
        return res.status(400).json({ message: 'Project name is required' });
    }

    // Assuming the "created_by" is the currently logged-in user, you can get it from the session
    const createdBy = req.session.username; // Update this based on your session implementation

    // Example SQL query to insert project into database with creation timestamp
    const insertProjectQuery = `INSERT INTO projects (project_name, task, due_date, created_by, assigned_to, created_on) VALUES (?, ?, ?, ?, ?, NOW())`;

    // Execute the query to insert the main project
    connection.query(insertProjectQuery, [projectName, task, dueDate, createdBy, assignedUser], (error, projectResults, fields) => {
        if (error) {
            console.error('Error creating main project:', error);
            res.status(500).json({ message: 'Failed to create project' });
        } else {
            const projectId = projectResults.insertId; // Get the ID of the newly inserted project

            // Loop through the sub-projects data and insert them into the database
            subProjectName.forEach((subProject, index) => {
                const subTaskValue = subTask[index];
                const subDueDateValue = subDueDate[index];
                const subAssignToValue = subAssignTo[index];

                const insertSubProjectQuery = `INSERT INTO sub_projects (project_id, sub_project_name, sub_task, sub_due_date) VALUES (?, ?, ?, ?)`;

                // Execute the query to insert sub-projects
                connection.query(insertSubProjectQuery, [projectId, subProject, subTaskValue, subDueDateValue, subAssignToValue], (subError, subResults, subFields) => {
                    if (subError) {
                        console.error('Error creating sub-project:', subError);
                        res.status(500).json({ message: 'Failed to create sub-project' });
                    }
                });
            });

            console.log('Project and sub-projects created successfully');
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

// Route to serve the HTML template with username variable
app.get('/script-data', (req, res) => {
    res.send(`var username = '${req.session.username}';`); // Send the username as a global JavaScript variable
});

let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

 // Inside your socket.io connection event
socket.on('message', (data) => {
    const { sender, message } = data;

    // Store the message in the database
    connection.query('INSERT INTO messages (sender, message) VALUES (?, ?)', [sender, message], (error, results, fields) => {
        if (error) {
            console.error('Error storing message:', error);
        } else {
            console.log('Message stored successfully');
        }
    });

    // Broadcast the message to other clients
    socket.broadcast.emit('chat-message', data);
});




// Route to fetch old messages
app.get('/oldmessages', authenticateUser, (req, res) => {
    connection.query('SELECT * FROM messages ORDER BY timestamp ASC', (error, results, fields) => {
        if (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: 'Failed to fetch messages' });
        } else {
            const messages = results.map(message => ({
                name: message.sender === req.session.username ? 'You' : message.sender,
                message: message.message,
                dateTime: message.timestamp, // Adjust the property name based on your database schema
            }));
            res.json({ messages });
        }
    });
});



  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`💬 Server is running on port ${PORT}`);
});