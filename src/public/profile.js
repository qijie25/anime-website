document.addEventListener('DOMContentLoaded', () => {
  const userId = sessionStorage.getItem('id');
  const username = sessionStorage.getItem('username');
  const email = sessionStorage.getItem('email');

  const profileForm = document.getElementById('profile-form');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const passwordFields = document.getElementById('password-fields');

  const profileImg = document.getElementById('profile-image');
  const uploadBtn = document.querySelector('.upload-image-btn');
  const fileInput = document.getElementById('profile-picture-upload');

  document.getElementById('username').textContent = username;
  document.getElementById('name').value = username;
  document.getElementById('email').value = email;

  // Toggle password fields visibility
  togglePasswordBtn.addEventListener('click', () => {
    if (passwordFields.classList.contains('hidden')) {
      passwordFields.classList.remove('hidden');
      togglePasswordBtn.textContent = 'Cancel password change';
    } else {
      passwordFields.classList.add('hidden');
      togglePasswordBtn.textContent = 'Change password';
    }
  });

  let originalProfileImageUrl = 'assets/profile-icon.png';
  let hasExistingProfileImage = false;

  // Load existing profile pictures
  async function loadProfilePictures() {
    try {
      const response = await fetch(`/users/profile-pictures/${userId}`);
      const data = await response.json();
      if (data.pictures.length > 0) {
        originalProfileImageUrl = data.pictures[data.pictures.length - 1];
        hasExistingProfileImage = true;
        profileImg.src = originalProfileImageUrl;
      }
    } catch (error) {
      console.error('Error loading profile pictures:', error);
    }
  }

  loadProfilePictures();

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const currentImageUrl = profileImg.src;

      if (currentImageUrl.includes('assets/profile-icon.png')) {
        // Keep the existing originalProfileImageUrl
      } else if (!currentImageUrl.startsWith('blob:')) {
        originalProfileImageUrl = currentImageUrl;
      }

      // Create preview
      const imageUrl = URL.createObjectURL(file);
      profileImg.src = imageUrl;

      profileImg.onload = function () {
        URL.revokeObjectURL(imageUrl);
      };
    }
  });

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a file!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/users/upload-profile-picture/${userId}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Profile picture uploaded!');
        // Update the original image URL to the new one
        if (result.user.profile_imgs && result.user.profile_imgs.length > 0) {
          originalProfileImageUrl = result.user.profile_imgs[result.user.profile_imgs.length - 1];
          hasExistingProfileImage = true;
        }
      } else {
        alert(`Error: ${result.message}`);
        profileImg.src = originalProfileImageUrl;
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image.');
      profileImg.src = originalProfileImageUrl;
    }
  });

  // Handle profile update
  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updatedUsername = document.getElementById('name').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword && newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('/users/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(userId),
          email,
          username: updatedUsername,
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Profile updated successfully!');
        sessionStorage.setItem('username', updatedUsername);
        document.getElementById('username').textContent = updatedUsername;
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  });
});
