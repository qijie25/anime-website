const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const registerBtn = document.getElementById('registerBtn');
let isValid = false;

// Check if username is already taken
function checkUsername() {
    const usernameValue = username.value.trim();
    const existingUsernames = JSON.parse(localStorage.getItem('existingUsernames')) || [];

    if (existingUsernames.includes(usernameValue)) {
        alert('Username is already taken. Please choose a different one.');
        username.value = '';
        return false;
    }

    return true;
}

// Check if email is already taken
function checkEmail() {
    const emailValue = email.value.trim();
    const existingEmails = JSON.parse(localStorage.getItem('existingEmails')) || [];

    if (existingEmails.includes(emailValue)) {
        alert('Email is already taken. Please choose a different one.');
        email.value = '';
        return false;
    }

    return true;
}

// Store username in local storage

function storeUsername() {
    const usernameValue = username.value.trim();

    if (usernameValue) {
        const existingUsernames = JSON.parse(localStorage.getItem('existingUsernames')) || [];

        existingUsernames.push(usernameValue);

        localStorage.setItem('existingUsernames', JSON.stringify(existingUsernames));
    }
}

// Validate form on submit

registerBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (checkUsername() && checkEmail()) {
        isValid = true;
    }
    if (isValid) {
        storeUsername();
        isValid = false;
    } else {

    }
});

function validateUsername() {
  const usernameValue = document.getElementById("username").value;
  const error = document.getElementById("usernameError");
  if (usernameValue === "" || usernameValue.trim().length === 0) {
    error.textContent = "This field is required.";
  } else if (usernameValue.length < 3) {
    error.textContent = "Username must be at least 3 characters.";
  } else {
    error.textContent = "";
  }
  toggleRegisterButton();
}

function validateEmail() {
  const emailValue = document.getElementById("email").value;
  const error = document.getElementById("emailError");
  const emailPattern = /^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+)\.[A-Za-z]{2,8}$/;
  if (emailValue === "" || emailValue.trim().length === 0) {
    error.textContent = "This field is required.";
  } else if (!emailPattern.test(emailValue)) {
    error.textContent = "Invalid email format.";
  } else {
    error.textContent = "";
  }
  toggleRegisterButton();
}

function validatePassword() {
  const passwordValue = document.getElementById("password").value;
  const error = document.getElementById("passwordError");
  if (passwordValue === "" || passwordValue.trim().length === 0) {
    error.textContent = "This field is required.";
  } else if (passwordValue.length < 6) {
    error.textContent = "Password must be at least 6 characters.";
  } else {
    error.textContent = "";
  }
  toggleRegisterButton();
}

function validateConfirmPassword() {
  const passwordValue = document.getElementById("password").value;
  const confirmPasswordValue = document.getElementById("confirmPassword").value;
  const error = document.getElementById("confirmPasswordError");
  if (confirmPasswordValue === "" || confirmPasswordValue.trim().length === 0) {
    error.textContent = "This field is required.";
  } else if (passwordValue !== confirmPasswordValue) {
    error.textContent = "Passwords do not match.";
  } else {
    error.textContent = "";
  }
  toggleRegisterButton();
}

function validateCheckbox() {
  const checkbox = document.getElementById("rememberMe");
  const error = document.getElementById("checkboxError");
  if (!checkbox.checked) {
    error.textContent = "Please check this box.";
  } else {
    error.textContent = "";
  }
  toggleRegisterButton();
}

function toggleRegisterButton() {
  const usernameError = document.getElementById("usernameError").textContent;
  const emailError = document.getElementById("emailError").textContent;
  const passwordError = document.getElementById("passwordError").textContent;
  const confirmPasswordError = document.getElementById("confirmPasswordError").textContent;
  const checkboxError = document.getElementById("checkboxError").textContent;
  const registerButton = document.getElementById("registerBtn");

  registerButton.disabled = usernameError || emailError || passwordError || confirmPasswordError || checkboxError;
}

document.getElementById("username").addEventListener("input", validateUsername);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("password").addEventListener("input", validatePassword);
document.getElementById("confirmPassword").addEventListener("input", validateConfirmPassword);
document.getElementById("rememberMe").addEventListener("input", validateCheckbox);

function validateForm() {
  validateUsername();
  validateEmail();
  validatePassword();
  validateConfirmPassword();
  validateCheckbox();

  // Prevent form submission if there are errors
  return !(
    document.getElementById("usernameError").textContent ||
    document.getElementById("emailError").textContent ||
    document.getElementById("passwordError").textContent ||
    document.getElementById("confirmPasswordError").textContent ||
    document.getElementById("checkboxError").textContent
  );
}
