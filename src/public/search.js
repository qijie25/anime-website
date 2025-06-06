function createAnimeCard(anime) {
  const template = document.getElementById('anime-card-template');
  const clone = template.content.cloneNode(true);

  const box = clone.querySelector('.recently-updated-box');
  const img = clone.querySelector('img');
  const ratingBtn = clone.querySelector('.rating-btn');
  const ratingNum = clone.querySelector('.rating-num');
  const title = clone.querySelector('.box-title');
  const genreText = clone.querySelector('.genre');
  const releaseDate = clone.querySelector('.release-date');

  img.src = anime.img_url;
  img.alt = anime.title;
  ratingNum.textContent = anime.avgRating ? anime.avgRating.toFixed(1) : '0.0';
  title.textContent = anime.title;

  if (anime.genres && Array.isArray(anime.genres)) {
    genreText.textContent = anime.genres.slice(0, 2).join(', ');
  } else {
    genreText.textContent = 'Unknown';
  }

  const year = new Date(anime.date_aired).getFullYear();
  releaseDate.textContent = `${year}`;

  ratingBtn.addEventListener('click', () => {
    const userId = sessionStorage.getItem('id');
    if (userId !== null) {
      sessionStorage.setItem('selectedAnimeId', anime.id);
      window.location.href = 'rating.html';
    } else {
      alert('Please log in to rate an anime.');
    }
  });

  return clone;
}

function generateGenreOptions(selectedGenres = []) {
  const genreOptions = document.getElementById('genre-options');
  genreOptions.innerHTML = ''; // Clear existing options

  const genreLabel = document.querySelector('.dropdown-toggle');

  // Fetch genres
  fetch('/genres')
    .then((res) => res.json())
    .then((genres) => {
      genres.forEach((genre) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = genre.name;
        checkbox.name = 'genre';

        if (selectedGenres.includes(genre.name.toLowerCase())) {
          checkbox.checked = true;
        }

        checkbox.addEventListener('change', updateGenreLabel);

        label.appendChild(checkbox);
        label.append(` ${genre.name}`);
        genreOptions.appendChild(label);
      });
    })
    .catch((err) => console.error('Failed to load genres:', err));

  function updateGenreLabel() {
    const checked = Array.from(document.querySelectorAll("input[name='genre']:checked")).map(
      (cb) => cb.value,
    );
    genreLabel.textContent = checked.length > 0 ? checked.join(', ') : 'All';
  }
}

function generateYearOptions(selectedYears = []) {
  const yearOptions = document.getElementById('year-options');
  const yearLabel = document.getElementById('year-label');
  yearOptions.innerHTML = ''; // Clear previous

  const startYear = 2010;
  const endYear = 2025;

  for (let year = endYear; year >= startYear; year--) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = year;
    checkbox.name = 'year';

    if (selectedYears.includes(year.toString())) {
      checkbox.checked = true;
    }

    checkbox.addEventListener('change', updateYearLabel);

    label.appendChild(checkbox);
    label.append(` ${year}`);
    yearOptions.appendChild(label);
  }

  function updateYearLabel() {
    const checked = Array.from(document.querySelectorAll("input[name='year']:checked")).map(
      (cb) => cb.value,
    );
    yearLabel.textContent = checked.length > 0 ? checked.join(', ') : 'All';
  }
}

document.querySelector('.filter-btn').addEventListener('click', () => {
  const checkedGenres = Array.from(document.querySelectorAll("input[name='genre']:checked")).map(
    (cb) => cb.value,
  );

  const checkYears = Array.from(document.querySelectorAll("input[name='year']:checked")).map(
    (cb) => cb.value,
  );

  const type = document.getElementById('type').value;
  const status = document.getElementById('status').value;

  const params = new URLSearchParams();

  // Add each genre as a separate query parameter
  checkedGenres.forEach((genre) => params.append('genres', genre));
  checkYears.forEach((year) => params.append('year', year));
  if (type) params.append('type', type);
  if (status) params.append('status', status);

  fetch(`/animes/filter?${params.toString()}`)
    .then((res) => res.json())
    .then((animes) => {
      displayAnimeGrid(animes);
      generateGenreOptions(checkedGenres.map((g) => g.toLowerCase())); // persist selection
    })
    .catch((err) => console.error('Failed to fetch filtered anime:', err));
});

function displayAnimeGrid(animes) {
  const grid = document.getElementById('recently-updated-grid');
  grid.innerHTML = '';

  animes.forEach((anime) => {
    const card = createAnimeCard(anime);
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query');

  // Allow multiple dropdowns to toggle independently
  document.querySelectorAll('.dropdown-toggle').forEach((toggleBtn) => {
    toggleBtn.addEventListener('click', function (e) {
      // Find the closest parent .dropdown container
      const dropdown = this.closest('.dropdown');

      // Close all other open dropdowns
      document.querySelectorAll('.dropdown.open').forEach((el) => {
        if (el !== dropdown) {
          el.classList.remove('open');
        }
      });

      // Toggle the clicked one
      dropdown.classList.toggle('open');

      e.stopPropagation();
    });
  });

  // Close dropdowns if user clicks outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.open').forEach((el) => {
      el.classList.remove('open');
    });
  });

  generateGenreOptions();
  generateYearOptions();

  try {
    const res = await fetch(`/animes/search?query=${encodeURIComponent(query)}`);
    const animes = await res.json();

    if (!Array.isArray(animes)) {
      throw new Error('Invalid response: expected an array of animes');
    }

    document.querySelector('h2').textContent = `Search results for "${query}"`;

    displayAnimeGrid(animes);
  } catch (err) {
    console.error('Failed to fetch search results:', err);
  }
});
