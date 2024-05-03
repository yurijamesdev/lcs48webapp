const express = require('express');
const http = require('http');
const mysql = require('mysql');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// MySQL database connection configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'your_database_name',
});

// Handle socket.io events
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle chat message event
    socket.on('chat message', (msg) => {
        const sender = 'Anonymous'; // Replace with actual sender's username or ID
        const timestamp = new Date().toISOString();

        const query = 'INSERT INTO messages (sender, content, timestamp) VALUES (?, ?, ?)';
        pool.query(query, [sender, msg, timestamp], (error, results) => {
            if (error) {
                console.error('Error inserting message:', error);
                return;
            }
            io.emit('chat message', { sender, content: msg, timestamp });
        });
    });

    // More socket.io event handlers can be added here
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
