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








// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
