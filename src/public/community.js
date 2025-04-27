const user_id = sessionStorage.getItem("id");

function createMessageElement(message, currentUserId) {
  const template = document.getElementById("message-template");
  const messageElement = template.content.cloneNode(true);

  const messageWrapper = messageElement.querySelector(".message-wrapper");
  if (!messageWrapper) {
    console.error("Message wrapper not found in template");
    return;
  }

  messageWrapper.setAttribute("data-message-id", message.id);
  messageWrapper.querySelector(".message-username").textContent = message.user
    ? message.user.username
    : "Anonymous";
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

  // Container for replies
  const replyContainer = messageWrapper.querySelector(".reply-container");
  const replyToggleContainer = messageWrapper.querySelector(".reply-toggle-container");
  const toggleText = messageWrapper.querySelector(".toggle-replies-text");

  if (message.replies && message.replies.length > 0) {
    replyToggleContainer.classList.remove("hidden");
    toggleText.textContent = `View ${message.replies.length} repl${message.replies.length > 1 ? "ies" : "y"}`;

    // Show/hide replies on toggle click
    replyToggleContainer.addEventListener("click", () => {
      replyContainer.classList.toggle("hidden");
      const showing = !replyContainer.classList.contains("hidden");
      toggleText.textContent = showing ? `Hide repl${message.replies.length > 1 ? "ies" : "y"}` : `View ${message.replies.length} repl${
        message.replies.length > 1 ? "ies" : "y"
      }`;
    });
  }

  // If this message has replies, render them
  if (message.replies && message.replies.length > 0) {
    message.replies.forEach((reply) => {
      const replyElement = createMessageElement(reply, currentUserId);
      replyContainer.appendChild(replyElement);
    });
  }

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
      const messageHistoryBox = document.getElementById("message-historybox");
      messageHistoryBox.innerHTML = "";
      const { messages, user_id: currentUserId } = data;

      // Only render top-level messages
      messages
        .filter((m) => m.parent_id === null)
        .forEach((message) => {
          const messageElement = createMessageElement(message, currentUserId);
          messageHistoryBox.appendChild(messageElement);
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
    .then(() => {
      // After liking successfully, fetch the updated like count
      return fetch(`/messagesLikes/${messageId}/like-count`);
    })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch like count");
      return response.json();
    })
    .then((data) => {
      // Update only the specific like count without reloading all messages
      likeCountElement.textContent = data.likeCount;
    })
    .catch((error) => {
      alert("You already liked this message");
      console.error("Error increasing like count:", error);
    });
}

// Show options menu
function showOptionsMenu(message, messageWrapper, currentUserId) {
  const optionMenu = messageWrapper
    .closest(".menu-wrapper")
    .querySelector(".option-menu");

  if (!optionMenu) {
    console.error("Option menu not found.");
    return;
  }

  document.querySelectorAll(".option-menu").forEach((menu) => {
    if (menu !== optionMenu) menu.style.display = "none";
  });

  // Clear existing options
  optionMenu.innerHTML = "";

  // Check if the current user is the owner
  const isOwner = message.user.id === +currentUserId;

  if (isOwner) {
    optionMenu.innerHTML = `
      <button type="button" class="update-btn">Update</button>
      <button type="button" class="delete-btn">Delete</button>
    `;

    optionMenu.querySelector(".update-btn").addEventListener("click", () => updateMessage(message.id));
    optionMenu.querySelector(".delete-btn").addEventListener("click", () => deleteMessage(message.id));
  } else {
    optionMenu.innerHTML = `
      <button type="button" class="report-btn">Report</button>
      <button type="button" class="reply-btn">Reply</button>
    `;

    optionMenu.querySelector(".report-btn").addEventListener("click", () => {
      const description = prompt(
        "Please provide a reason for reporting this message:"
      );
      if (description && description.trim() !== "") {
        reportMessage(message.id, description);
      } else {
        alert("Report description cannot be empty.");
      }
    });

    optionMenu.querySelector(".reply-btn").addEventListener("click", () => {
      openReplyModal(message.id);
    });
  }

  // Show the menu
  optionMenu.style.display = "flex";
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
    const messageHistoryBox = document.getElementById("message-historybox");
    messageHistoryBox.scrollTop = messageHistoryBox.scrollHeight;

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

let currentReplyParentId = null;

function openReplyModal(parentId) {
  currentReplyParentId = parentId;
  document.getElementById("replyModal").style.display = "block";
}

const modal = document.getElementById("replyModal");
const closeBtn = document.querySelector(".close-btn");
closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
    const isClickInsideOptionsMenu = event.target.closest(".option-menu");
    const isClickOnOptionsIcon = event.target.closest(".bx-dots-vertical-rounded");
  if (event.target === modal) {
    modal.style.display = "none";
  }
  if (!isClickInsideOptionsMenu && !isClickOnOptionsIcon) {
    document.querySelectorAll(".option-menu").forEach((menu) => {
      menu.style.display = "none";
    });
  }
}

document.getElementById("submitReply").addEventListener("click", () => {
  const replyText = document.getElementById("replyText").value.trim();
  if (!replyText) return alert("Reply cannot be empty.");

  fetch("/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: +user_id,
      text: replyText,
      parent_id: currentReplyParentId,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Reply failed");
      document.getElementById("replyText").value = "";
      document.getElementById("replyModal").style.display = "none";
      fetchMessages();
    })
    .catch((err) => console.error("Reply error:", err));
});

const accordions = document.querySelectorAll(".accordion");

accordions.forEach((accordion, index) => {
  const header = accordion.querySelector(".accordion-header");
  const content = accordion.querySelector(".accordion-content");
  const icon = accordion.querySelector("#accordion-icon");

  header.addEventListener("click", () => {
    const isOpen = content.style.height === `${content.scrollHeight}px`;

    accordions.forEach((a, i) => {
      const c = a.querySelector(".accordion-content");
      const ic = a.querySelector("#accordion-icon");

      c.style.height = i === index && !isOpen ? `${c.scrollHeight}px` : "0px";

      ic.classList.remove("bx-plus", "bx-minus");

      ic.classList.add("bx");

      // Add correct icon class
      if (i === index && !isOpen) {
        ic.classList.add("bx-minus");
      } else {
        ic.classList.add("bx-plus");
      }
    });
  });
});