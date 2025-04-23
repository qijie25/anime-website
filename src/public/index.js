// Check login status and update the header
const loginStatus = sessionStorage.getItem("loginStatus");
const userId = sessionStorage.getItem("id");

const loginButton = document.getElementById("login-btn");
const userProfile = document.getElementById("user-profile");
const userNotification = document.getElementById("user-notification");
const logoutButton = document.getElementById("logout-btn");
const profileImg = document.getElementById("profileImage");

if (loginStatus === "success" && userId) {
  // User is logged in
  loginButton.style.display = "none"; // Hide login button
  userProfile.style.display = "flex"; // Show profile icon and logout button
  userNotification.style.display = "flex";
} else {
  // User is not logged in
  loginButton.style.display = "block"; // Show login button
  userProfile.style.display = "none"; // Hide profile icon and logout button
  userNotification.style.display = "none";
}

// Logout functionality
logoutButton.addEventListener("click", function () {
  sessionStorage.clear(); // Clear session storage
  window.location.href = "/signin.html"; // Redirect to login page
});

// Profile Menu Toggle
document.querySelector(".profile").addEventListener("click", function () {
  document.querySelector(".profile-menu").classList.toggle("show");
});

// Close menus if clicked outside
window.addEventListener("click", function (e) {
  if (!e.target.closest(".profile")) {
    document.querySelector(".profile-menu").classList.remove("show");
  }
});

  async function loadProfilePictures() {
    try {
      const response = await fetch(`/users/profile-pictures/${userId}`);
      const data = await response.json();
      if (data.pictures.length > 0) {
        profileImg.src = data.pictures[data.pictures.length - 1]; // Show latest picture
      }
    } catch (error) {
      console.error("Error loading profile pictures:", error);
    }
  }

  loadProfilePictures();

  const hamburger = document.getElementById("hamburger");
  const navbar = document.querySelector(".navbar");

  hamburger.addEventListener("click", () => {
    navbar.classList.toggle("show");
  });

  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
      // Redirect to search results page with query as a URL parameter
      window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
    }
  });
