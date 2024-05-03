
document.addEventListener('DOMContentLoaded', function() {
    const myProjectsButton = document.getElementById('myprojectsbtn');
    myProjectsButton.addEventListener('click', function(event) {
        // Prevent the default action of the anchor tag (navigation) to be able to handle it programmatically
        event.preventDefault();
        
        // Navigate to the /myprojects route using fetch or window.location.href
        // Method 1: Using fetch
        fetch('/myprojects')
            .then(response => response.text())
            .then(data => {
                document.documentElement.innerHTML = data; // Replace the current HTML with the response from the /myprojects route
            })
            .catch(error => console.error('Error:', error));
        
        // Method 2: Using window.location.href (this will reload the entire page)
        // window.location.href = '/myprojects';
    });
});

// code for chat panel

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

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (message !== '') {
        socket.emit('chat message', message);
        messageInput.value = '';
    }
}
