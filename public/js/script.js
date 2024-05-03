document.addEventListener('DOMContentLoaded', function() {
    // Button click event listener for "My Projects" button
    const myProjectsButton = document.getElementById('myprojectsbtn');
    myProjectsButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/myprojects';
    });

    // Button click event listener for "Chat Room" button
    const chatRoomButton = document.getElementById('chatroombtn');
    chatRoomButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/chat';
    });

    // Button click event listener for "All Projects" button
    const allProjectsButton = document.getElementById('allprojectsbtn');
    allProjectsButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/allprojects';
    });

    // Chat panel implementation using Socket.IO
    const socket = io();

    socket.on('connect', () => {
        socket.emit('get message history');
    });

    socket.on('message history', (messages) => {
        const messageContainer = document.getElementById('messageContainer');
        messages.reverse().forEach((msg) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `<strong>${msg.sender}</strong>: ${msg.content} (${new Date(msg.timestamp).toLocaleTimeString()})`;
            messageContainer.appendChild(messageElement);
        });
    });

    socket.on('chat message', (msg) => {
        const messageContainer = document.getElementById('messageContainer');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${msg.sender}</strong>: ${msg.content} (${new Date(msg.timestamp).toLocaleTimeString()})`;
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    // Function to send a message
    function sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        if (message !== '') {
            socket.emit('chat message', message);
            messageInput.value = '';
        }
    }

    // Event listener for sending a message when the "Send" button is clicked
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', sendMessage);
});
