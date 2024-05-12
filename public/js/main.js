fetch('/script-data')
          .then(response => response.text())
          .then(data => {
              // Evaluate the data as JavaScript to set the username as a global variable
              eval(data);
              console.log('Username:', username);
              nameInput.value = username;
              // Now 'username' is accessible in your script.js file
          })
          .catch(error => console.error('Error fetching username data:', error));

// Fetch old messages
fetch('/oldmessages')
    .then(response => response.json())
    .then(data => {
        // Process retrieved messages, e.g., display in chat interface
        console.log('Old Messages:', data.messages);
        // Update your chat interface with old messages
        data.messages.forEach(message => {
            addMessageToUI(message.name === 'You', message); // Adjust the condition based on your username representation
        });
    })
    .catch(error => console.error('Error fetching old messages:', error));




    
function sendMessage() {
    if (messageInput.value === '') return;

    const data = {
        sender: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    };

    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';

    
}


const socket = io()

const clientsTotal = document.getElementById('client-total')

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('/message-tone.mp3')

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  sendMessage()

})

socket.on('clients-total', (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`
})

function sendMessage() {
  if (messageInput.value === '') return;

  const data = {
    sender: nameInput.value, // Set the sender field correctly
    message: messageInput.value,
    dateTime: new Date(),
  };

  socket.emit('message', data);
  addMessageToUI(true, data);
  messageInput.value = '';
  nameInput.value = username; 
}



socket.on('chat-message', (data) => {
  // console.log(data)
  messageTone.play()
  addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const messageClass = isOwnMessage ? 'message-right' : 'message-left'; // Determine message alignment class
  const element = `
    <li class="${messageClass}">
      <p class="message">
        ${data.message}
        <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
      </p>
    </li>
  `;
  messageContainer.innerHTML += element;
  scrollToBottom();
}


function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} is typing a message`,
  })
})

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} is typing a message`,
  })
})
messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: '',
  })
})

socket.on('feedback', (data) => {
  clearFeedback()
  const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `
  messageContainer.innerHTML += element
})

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element)
  })
}
