const sideLogout = document.getElementById('side-logout');

sideLogout.addEventListener('click', () => {
  sessionStorage.clear();
  window.location.href = '/signin.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const isAdmin = sessionStorage.getItem('isAdmin');
  if (isAdmin !== 'true') {
    window.location.href = '/index.html';
    return;
  }
});
