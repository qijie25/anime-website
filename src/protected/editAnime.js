const form = document.getElementById('edit-anime-form');
const animeId = new URLSearchParams(window.location.search).get('id');
const genreSelect = document.getElementById('animeGenre');

async function loadGenres(selectedGenres = []) {
  try {
    const res = await fetch('/genres');
    const genres = await res.json();

    genres.forEach((genre) => {
      const option = document.createElement('option');
      option.value = genre.name;
      option.textContent = genre.name;
      if (selectedGenres.includes(genre.name)) {
        option.selected = true;
      }

      genreSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load genres:', err);
  }
}

// Load current anime data
async function loadAnimeData() {
  try {
    const res = await fetch(`/animes/${animeId}`);
    const anime = await res.json();

    form.title.value = anime.title;
    form.description.value = anime.description;
    form.type.value = anime.type;
    form.studios.value = anime.studios;
    form.status.value = anime.status;

    if (anime.date_aired) {
      const airedDate = new Date(anime.date_aired);
      form.date_aired.value = airedDate.toISOString().slice(0, 16);
    }

    // Call genre loader with current anime genres
    loadGenres(anime.genres || []);
  } catch (err) {
    console.error('Failed to load anime:', err);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const res = await fetch(`/animes/${animeId}`, {
    method: 'PUT',
    body: formData,
  });

  if (res.ok) {
    alert('Anime updated!');
    window.location.href = '/admin/anime-management';
  } else {
    alert('Update failed');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const isAdmin = sessionStorage.getItem('isAdmin');
  if (isAdmin !== 'true') {
    window.location.href = '/index.html';
    return;
  }
  loadAnimeData();
});
