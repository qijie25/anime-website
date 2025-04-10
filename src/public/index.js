// Check login status and update the header
const loginStatus = sessionStorage.getItem("loginStatus");
const userId = sessionStorage.getItem("id");

const loginButton = document.getElementById("login-btn");
const userProfile = document.getElementById("user-profile");
const logoutButton = document.getElementById("logout-btn");

if (loginStatus === "success" && userId) {
  // User is logged in
  loginButton.style.display = "none"; // Hide login button
  userProfile.style.display = "flex"; // Show profile icon and logout button
} else {
  // User is not logged in
  loginButton.style.display = "block"; // Show login button
  userProfile.style.display = "none"; // Hide profile icon and logout button
}

// Logout functionality
logoutButton.addEventListener("click", function () {
  sessionStorage.clear(); // Clear session storage
  window.location.href = "/signin.html"; // Redirect to login page
});
