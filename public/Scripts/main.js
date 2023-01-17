const socket = io();

let clientsTotal = document.querySelector('#client-total');
let messageContainer = document.querySelector('#message-container');
let nameInput = document.querySelector('#name-input');
let messageForm = document.querySelector('#message-form');
let messageInput =document.querySelector('#message-input');

let messageTone = new Audio('/public_message-tone.mp3');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessagge()
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients : ${data}`;
})

function sendMessagge() {
    if (messageInput.value.trim() == '') return;

    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    
    socket.emit('message', data);
    addMessage(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    messageTone.play()
    addMessage(false, data);
})

function addMessage(isOwnMessage, data) {
    clearFeedback()
    let element = `
    <li class=" ${isOwnMessage ? "message-right" : "message-left"}">
        <p class="message">
            ${data.message} 
            <span>
            ${data.name} ⌚ ${moment(data.dateTime).fromNow()}
            </span> 
        </p>
    </li>
    `
    messageContainer.innerHTML += element;
    scrollToBottom()
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `✍🏻 ${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ``
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
    <li class="message-feedback">
        <p class="feedback" id="feedback">
        ${data.feedback}
        </p>
    </li>
    `;

    messageContainer.innerHTML += element;
})

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    })
}