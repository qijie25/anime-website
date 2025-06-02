/* eslint-disable consistent-return */
const user_id = sessionStorage.getItem('id');
// eslint-disable-next-line no-undef
const socket = io();
let currentReplyParentId = null;
const displayedMessageIds = new Set(); // Track displayed messages

if (!user_id) {
  window.location.href = '/signin.html';
}

function createMessageElement(message, currentUserId) {
  const template = document.getElementById('message-template');
  const messageElement = template.content.cloneNode(true);
  const messageWrapper = messageElement.querySelector('.message-wrapper');

  if (!messageWrapper) {
    console.error('Message wrapper not found in template');
    return null;
  }

  messageWrapper.setAttribute('data-message-id', message.id);
  messageWrapper.querySelector('.message-username').textContent =
    message.user?.username || 'Anonymous';
  messageWrapper.querySelector('.message').textContent = message.text || '';

  const likeCount = messageWrapper.querySelector('.like-count');
  likeCount.textContent = message.likeCount || 0;

  messageWrapper.querySelector('.bx-like').addEventListener('click', () => {
    increaseLike(message.id, likeCount);
  });

  const optionsIcon = messageWrapper.querySelector('.bx-dots-vertical-rounded');
  optionsIcon.addEventListener('click', () => {
    showOptionsMenu(message, messageWrapper, user_id);
  });

  loadProfilePictures(message.user?.id, messageWrapper);

  const replyContainer = messageWrapper.querySelector('.reply-container');
  const replyToggleContainer = messageWrapper.querySelector('.reply-toggle-container');
  const toggleText = messageWrapper.querySelector('.toggle-replies-text');

  if (message.replies?.length > 0) {
    replyToggleContainer.classList.remove('hidden');
    toggleText.textContent = `View ${message.replies.length} repl${message.replies.length > 1 ? 'ies' : 'y'}`;

    message.replies.forEach((reply) => {
      const replyElement = createMessageElement(reply, currentUserId);
      if (replyElement) replyContainer.appendChild(replyElement);
    });

    setReplyToggleBehavior(toggleText, replyContainer);
  }

  return messageElement;
}

async function loadProfilePictures(userId, messageWrapper) {
  if (!userId) return;
  try {
    const response = await fetch(`/users/profile-pictures/${userId}`);
    const data = await response.json();
    const profilePicture = messageWrapper.querySelector('.profile-icon');

    if (data.pictures?.length > 0) {
      profilePicture.src = data.pictures[data.pictures.length - 1];
    } else {
      profilePicture.src = 'assets/profile-icon.png';
    }
  } catch (error) {
    console.error('Error loading profile pictures:', error);
  }
}

// Fetch and render messages
function fetchMessages() {
  fetch(`/messages`)
    .then((response) => response.json())
    .then((data) => {
      const messageHistoryBox = document.getElementById('message-historybox');
      messageHistoryBox.innerHTML = '';
      displayedMessageIds.clear(); // Reset displayed messages

      const { messages, user_id: currentUserId } = data;

      messages
        .filter((m) => m.parent_id === null)
        .forEach((message) => {
          const messageElement = createMessageElement(message, currentUserId);
          if (messageElement) {
            messageHistoryBox.appendChild(messageElement);
            displayedMessageIds.add(message.id);
          }
        });
    })
    .catch((error) => console.error('Error fetching messages:', error));
}

function sendMessageToServer(text) {
  if (!user_id) {
    alert('Please login to use this feature.');
    return;
  }

  const messageData = {
    user_id: +user_id,
    text,
    parent_id: null,
  };

  socket.emit('newMessage', messageData, (savedMessage) => {
    displayNewMessage(savedMessage);
  });
}

// Display a single new message dynamically (with duplicate protection)
function displayNewMessage(messageData) {
  if (displayedMessageIds.has(messageData.id)) {
    console.log('Duplicate message ignored:', messageData.id);
    return;
  }

  const messageHistoryBox = document.getElementById('message-historybox');
  const { user_id: currentUserId } = window;

  const messageElement = createMessageElement(messageData, currentUserId);
  if (messageElement) {
    messageHistoryBox.appendChild(messageElement);
    displayedMessageIds.add(messageData.id);

    // Smooth scroll to bottom
    messageHistoryBox.scrollTo({
      top: messageHistoryBox.scrollHeight,
      behavior: 'smooth',
    });
  }
}

// Receive new message from socket
socket.on('newMessage', (messageData) => {
  console.log('Received new message via socket:', messageData);
  displayNewMessage(messageData);
});

// Like updates
socket.on('likeUpdated', ({ messageId, likeCount }) => {
  const msgEl = document.querySelector(`[data-message-id='${messageId}']`);
  if (msgEl) {
    const likeEl = msgEl.querySelector('.like-count');
    if (likeEl) likeEl.textContent = likeCount;
  }
});

// Message updates
socket.on('messageUpdated', (updatedMessage) => {
  const msgEl = document.querySelector(`[data-message-id='${updatedMessage.id}']`);
  if (msgEl) {
    msgEl.querySelector('.message').textContent = updatedMessage.text;
  }
});

// Message deletions
socket.on('messageDeleted', (messageId) => {
  const msgEl = document.querySelector(`[data-message-id='${messageId}']`);
  if (msgEl) msgEl.remove();
  displayedMessageIds.delete(messageId);
});

// Reply added
socket.on('replyAdded', (replyMessage) => {
  const parent = document.querySelector(`[data-message-id='${replyMessage.parent_id}']`);
  if (parent) {
    const replyContainer = parent.querySelector('.reply-container');
    const replyToggleContainer = parent.querySelector('.reply-toggle-container');
    const toggleText = parent.querySelector('.toggle-replies-text');

    if (replyContainer && replyToggleContainer && toggleText) {
      const replyElement = createMessageElement(replyMessage, +user_id);
      replyContainer.appendChild(replyElement);

      replyContainer.classList.remove('hidden');
      replyToggleContainer.classList.remove('hidden');

      const replyCount = replyContainer.children.length;
      toggleText.textContent = `Hide repl${replyCount > 1 ? 'ies' : 'y'}`;

      // Only bind toggle behavior if it doesn't already have a listener
      if (!toggleText.hasAttribute('data-toggle-bound')) {
        setReplyToggleBehavior(toggleText, replyContainer);
        toggleText.setAttribute('data-toggle-bound', 'true');
      }
    }
  }
});

// Increase like
function increaseLike(messageId, likeCountElement) {
  if (!user_id) {
    alert('Please login like this message.');
    return;
  }
  fetch(`/messagesLikes/${messageId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: +user_id }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Failed to like the message');
      return response.json();
    })
    .then(() => fetch(`/messagesLikes/${messageId}/like-count`))
    .then((response) => response.json())
    .then((data) => {
      likeCountElement.textContent = data.likeCount;
      socket.emit('likeMessage', { messageId, likeCount: data.likeCount });
    })
    .catch((error) => {
      alert('You already liked this message.');
      console.error('Error increasing like count:', error);
    });
}

// Show options menu
function showOptionsMenu(message, messageWrapper, currentUserId) {
  const optionMenu = messageWrapper.closest('.menu-wrapper')?.querySelector('.option-menu');

  if (!optionMenu) return console.error('Option menu not found');

  document.querySelectorAll('.option-menu').forEach((menu) => {
    if (menu !== optionMenu) menu.style.display = 'none';
  });

  optionMenu.innerHTML = '';
  const isOwner = message.user?.id === +currentUserId;

  if (isOwner) {
    optionMenu.innerHTML = `
      <button type="button" class="update-btn">Update</button>
      <button type="button" class="delete-btn">Delete</button>
    `;

    optionMenu
      .querySelector('.update-btn')
      .addEventListener('click', () => updateMessage(message.id));
    optionMenu
      .querySelector('.delete-btn')
      .addEventListener('click', () => deleteMessage(message.id));
  } else {
    optionMenu.innerHTML = `
      <button type="button" class="report-btn">Report</button>
      <button type="button" class="reply-btn">Reply</button>
    `;

    optionMenu.querySelector('.report-btn').addEventListener('click', () => {
      const description = prompt('Please provide a reason for reporting this message:');
      if (description?.trim()) {
        reportMessage(message.id, description);
      } else {
        alert('Report description cannot be empty.');
      }
    });

    optionMenu.querySelector('.reply-btn').addEventListener('click', () => {
      openReplyModal(message.id);
    });
  }

  optionMenu.style.display = 'flex';
}

function setReplyToggleBehavior(toggleText, replyContainer) {
  const updateToggleText = () => {
    const replyCount = replyContainer.children.length;
    const showing = !replyContainer.classList.contains('hidden');
    toggleText.textContent = showing
      ? `Hide repl${replyCount > 1 ? 'ies' : 'y'}`
      : `View ${replyCount} repl${replyCount > 1 ? 'ies' : 'y'}`;
  };

  toggleText.addEventListener('click', () => {
    replyContainer.classList.toggle('hidden');
    updateToggleText();
  });

  updateToggleText();
}

// Update, Delete, Report message
function updateMessage(messageId) {
  if (!user_id) {
    alert('Please login to update your message.');
    return;
  }
  const newMessageText = prompt('Enter the new message text:');
  if (!newMessageText?.trim()) {
    alert('Message text cannot be empty.');
    return;
  }

  fetch(`/messages/${messageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: newMessageText }),
  })
    .then(() => {
      const updatedMessage = { id: messageId, text: newMessageText };
      socket.emit('updateMessage', updatedMessage);
      alert('Message updated successfully.');
      fetchMessages();
    })
    .catch((error) => console.error('Error updating message:', error));
}

function deleteMessage(messageId) {
  if (!user_id) {
    alert('Please login to delete your message.');
    return;
  }
  fetch(`/messages/${messageId}`, { method: 'DELETE' })
    .then((response) => {
      if (response.ok) {
        document.querySelector(`[data-message-id='${messageId}']`)?.remove();
        displayedMessageIds.delete(messageId);
        socket.emit('deleteMessage', messageId);
        console.log('Message deleted successfully.');
      } else {
        console.error('Failed to delete the message.');
      }
    })
    .catch((error) => console.error('Error deleting message:', error));
}

function reportMessage(messageId, description) {
  fetch(`/messagesReport/${messageId}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: +user_id, description }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Message reported successfully!');
      console.log(`Total reports for this message: ${data.reportCount}`);
    })
    .catch((error) => {
      alert('You have already reported this message.');
      console.error('Error reporting message:', error);
    });
}

// Modal handling
function openReplyModal(parentId) {
  currentReplyParentId = parentId;
  document.getElementById('replyModal').style.display = 'block';
}

document.querySelector('.close-btn').onclick = () => {
  document.getElementById('replyModal').style.display = 'none';
};

window.onclick = (event) => {
  if (event.target === document.getElementById('replyModal')) {
    document.getElementById('replyModal').style.display = 'none';
  }

  if (!event.target.closest('.option-menu') && !event.target.closest('.bx-dots-vertical-rounded')) {
    document.querySelectorAll('.option-menu').forEach((menu) => (menu.style.display = 'none'));
  }
};

document.getElementById('submitReply').addEventListener('click', () => {
  if (!user_id) {
    alert('Please login to send a message.');
    return;
  }
  const replyText = document.getElementById('replyText').value.trim();
  if (!replyText) {
    alert('Reply text cannot be empty.');
    return;
  }

  fetch('/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: replyText,
      parent_id: currentReplyParentId,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Reply failed.');
      return res.json();
    })
    .then((replyMessage) => {
      socket.emit('addReply', replyMessage);
      document.getElementById('replyText').value = '';
      document.getElementById('replyModal').style.display = 'none';
    })
    .catch((err) => console.error('Reply error:', err));
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('messageForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = document.getElementById('message').value.trim();
    if (!text) return alert('Message cannot be empty.');
    sendMessageToServer(text);
    document.getElementById('message').value = '';
  });

  fetchMessages();
});

const accordions = document.querySelectorAll('.accordion');

accordions.forEach((accordion, index) => {
  const header = accordion.querySelector('.accordion-header');
  const content = accordion.querySelector('.accordion-content');

  header.addEventListener('click', () => {
    const isOpen = content.style.height === `${content.scrollHeight}px`;

    accordions.forEach((a, i) => {
      const c = a.querySelector('.accordion-content');
      const ic = a.querySelector('#accordion-icon');

      c.style.height = i === index && !isOpen ? `${c.scrollHeight}px` : '0px';

      ic.classList.remove('bx-plus', 'bx-minus');

      ic.classList.add('bx');

      // Add correct icon class
      if (i === index && !isOpen) {
        ic.classList.add('bx-minus');
      } else {
        ic.classList.add('bx-plus');
      }
    });
  });
});
