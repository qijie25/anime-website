const apiUrl = ".";
const user_id = sessionStorage.getItem("id");

function createMessageElement(message) {
  const template = document.getElementById("message-template");
  const messageElement = template.content.cloneNode(true);

  const messageWrapper = messageElement.querySelector(".message-wrapper");
  if (!messageWrapper) {
    console.error("Message wrapper not found in template");
    return;
  }

  messageWrapper.setAttribute("data-message-id", message.id);
  messageWrapper.querySelector(".message-username").textContent = message.user ? message.user.username : "Anonymous";
  messageWrapper.querySelector(".message").textContent = message.text || "";

  const likeCount = messageWrapper.querySelector(".like-count");
  likeCount.textContent = message.likeCount || 0;

  messageWrapper.querySelector(".bx-like").addEventListener("click", () => {
    increaseLike(message.id, likeCount);
  });

  const optionsIcon = messageWrapper.querySelector(".bx-dots-vertical-rounded");
  optionsIcon.addEventListener("click", () => {
    showOptionsMenu(message, messageWrapper, user_id);
  });

  loadProfilePictures(message.user.id, messageWrapper);

  return messageElement;
}

async function loadProfilePictures(userId, messageWrapper) {
  try {
    const response = await fetch(`/users/profile-pictures/${userId}`);
    const data = await response.json();

    const profilePicture = messageWrapper.querySelector(".profile-icon");
    if (!profilePicture) {
      console.error("Profile picture element not found in message wrapper");
      return;
    }

    if (data.pictures && data.pictures.length > 0) {
      profilePicture.src = data.pictures[data.pictures.length - 1]; // Show latest picture
    } else {
      profilePicture.src = "assets/profile-icon.png";
    }
  } catch (error) {
    console.error("Error loading profile pictures:", error);
  }
}

// Fetch and render messages
function fetchMessages() {
  fetch(`/messages`)
    .then((response) => response.json())
    .then((data) => {
      const commentHistoryBox = document.getElementById("message-historybox");
      commentHistoryBox.innerHTML = "";
      const { messages, user_id: currentUserId } = data;
      messages.forEach((message) => {
        if (message.text && message.text.trim() !== "") {
          const messageElement = createMessageElement(message, currentUserId);
          commentHistoryBox.appendChild(messageElement);
        }
      });
    })
    .catch((error) => console.error("Error fetching messages:", error));
}

function increaseLike(messageId, likeCountElement) {
  fetch(`/messagesLikes/${messageId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: +user_id }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to like the message");
      return response.json();
    })
    .then((data) => {
      likeCountElement.textContent = data.likeCount; // Update the like count
      fetchMessages();
    })
    .catch((error) => {
      alert("You already liked this message");
      console.error("Error increasing like count:", error);
    });
}

// Show options menu
function showOptionsMenu(message, messageWrapper, currentUserId) {
  const existingMenu = document.querySelector(".options-menu");
  if (existingMenu) existingMenu.remove();

  // Check if the current user is the owner
  const isOwner = message.user.id === +currentUserId;

  const optionsMenu = document.createElement("div");
  optionsMenu.classList.add("options-menu");

  if (isOwner) {
    optionsMenu.innerHTML = `
      <button type="button" class="update-btn">Update</button>
      <button type="button" class="delete-btn">Delete</button>
    `;
  }

  if (!isOwner) {
    optionsMenu.innerHTML += `
      <button type="button" class="report-btn">Report</button>
    `;
    optionsMenu.querySelector(".report-btn").addEventListener("click", () => {
      const description = prompt("Please provide a reason for reporting this message:");
      if (description && description.trim() !== "") {
        reportMessage(message.id, description);
      } else {
        alert("Report description cannot be empty.");
      }
    });
  }

  messageWrapper.appendChild(optionsMenu);

  if (isOwner) {
    optionsMenu.querySelector(".update-btn").addEventListener("click", () => updateMessage(message.id));
    optionsMenu.querySelector(".delete-btn").addEventListener("click", () => deleteMessage(message.id));
  }
}

// Update message
function updateMessage(messageId) {
  const newMessageText = prompt("Enter the new message text:");
  if (!newMessageText || newMessageText.trim() === "") {
    alert("Comment text cannot be empty.");
    return;
  }
  if (newMessageText) {
    fetch(`/messages/${messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newMessageText }),
    })
      .then(() => {
        alert("Message updated successfully");
        fetchMessages();
      })
      .catch((error) => console.error("Error updating message:", error));
  }
}

// Delete message
function deleteMessage(id) {
  fetch(`/messages/${id}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        const messageElement = document.querySelector(`[data-message-id='${id}']`);
        messageElement.remove();
        console.log("Message deleted successfully");
      } else {
        console.error("Failed to delete the message");
      }
    })
    .catch((error) => console.error("Error deleting message:", error));
}

function reportMessage(messageId, description) {
  fetch(`/messagesReport/${messageId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: +user_id, description }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to report the message");
      return response.json();
    })
    .then((data) => {
      alert("Message reported successfully!");
      console.log(`Total reports for this message: ${data.reportCount}`);
    })
    .catch((error) => {
      alert("You have already reported this message.");
      console.error("Error reporting message:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("messageForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = document.getElementById("message").value.trim();

    if (!text) {
      alert("Message cannot be empty");
      return;
    }

    fetch("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: +user_id,
        text,
      }),
    })
      .then(() => {
        console.log("Message added successfully");
        document.getElementById("message").value = "";
        fetchMessages();
      })
      .catch((error) => console.error("Error adding message:", error));
  });

  fetchMessages();
});