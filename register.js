const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const registerBtn = document.getElementById('registerBtn');
let isValid = false;

// Validate form inputs

function validatePassword() {
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    if (passwordValue !== confirmPasswordValue) {
        alert('Passwords do not match. Please try again.');
        return false;
    }

    return true;
}


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
    if (validatePassword() && checkUsername()) {
        isValid = true;
    }
    if (isValid) {
        storeUsername();
        isValid = false;
    } else {

    }
});