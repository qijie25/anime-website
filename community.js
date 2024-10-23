const communityHistoryBox = document.getElementById('community-historybox');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-btn');

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('communityMessages')) || [];

    communityHistoryBox.innerHTML = '';

    messages.forEach((msgObj) => {
        appendMessageToChat(msgObj.username, msgObj.message);
    });
}

function appendMessageToChat(username, message) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper');

    const profileIcon = document.createElement('span');
    profileIcon.classList.add('profile-icon');
    profileIcon.innerHTML = '<i class="bx bxs-user-circle"></i>';

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    const usernameElement = document.createElement('p');
    usernameElement.classList.add('msg-username');
    usernameElement.textContent = username || 'Tester';

    const messageText = document.createElement('p');
    messageText.classList.add('message');
    messageText.textContent = message;

    messageContainer.appendChild(usernameElement);
    messageContainer.appendChild(messageText);

    messageWrapper.appendChild(profileIcon);
    messageWrapper.appendChild(messageContainer);

    communityHistoryBox.appendChild(messageWrapper);
}

function storeMessage(username, message) {
    let messages = JSON.parse(localStorage.getItem('communityMessages')) || [];
    messages.push({ username, message });
    localStorage.setItem('communityMessages', JSON.stringify(messages));
}

sendButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (messageInput.value.trim().length > 0) {
        const username = 'Tester';
        const message = messageInput.value.trim();

        appendMessageToChat(username, message);

        storeMessage(username, message);

        messageInput.value = '';
    }
});

window.addEventListener('load', loadMessages);