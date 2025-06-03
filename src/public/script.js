const signupBtn = document.getElementById('signup-btn');
const aboutBtn = document.getElementById('about-btn');

// eslint-disable-next-line no-undef
if (loginStatus === 'success' && userId) {
  // User is logged in
  signupBtn.style.display = 'none';
  aboutBtn.style.display = 'block';
} else {
  // User is not logged in
  signupBtn.style.display = 'block';
  aboutBtn.style.display = 'none';
}

const helpIcon = document.getElementById('helpIcon');
const helpModal = document.querySelector('.help-modal');
const closeBtn = document.querySelector('.close-btn');
const helpPages = document.querySelectorAll('.help-page');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentPage = 0;

function showPage(index) {
  helpPages.forEach((page, i) => {
    page.classList.toggle('active', i === index);
  });

  // Disable prev/next when at the beginning or end
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === helpPages.length - 1;
  prevBtn.style.background = index === 0 ? '#555' : '#007bff';
  nextBtn.style.background = index === helpPages.length - 1 ? '#555' : '#007bff';
}

helpIcon.addEventListener('click', () => {
  helpModal.style.display = 'block';
  showPage(currentPage);
});

closeBtn.addEventListener('click', () => {
  helpModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === helpModal) {
    helpModal.style.display = 'none';
  }
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    showPage(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < helpPages.length - 1) {
    currentPage++;
    showPage(currentPage);
  }
});

function createAnimeCard(anime) {
  const template = document.getElementById('anime-card-template');
  const clone = template.content.cloneNode(true);

  const box = clone.querySelector('.recommendation-box');
  const img = clone.querySelector('.lazy-load');
  const ratingBtn = clone.querySelector('.rating-btn');
  const ratingNum = clone.querySelector('.rating-num');
  const title = clone.querySelector('.box-title');
  const genreText = clone.querySelector('.genre');
  const releaseDate = clone.querySelector('.release-date');

  img.dataset.src = anime.img_url;
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

  box.addEventListener('click', () => {
    window.location.href = `watch.html?id=${anime.id}`;
  });

  return clone;
}

function generateRecommendations() {
  fetch('/animes/top-rated')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((animeRecommendations) => {
      const recommendationsGrid = document.getElementById('recommendations-grid');
      recommendationsGrid.innerHTML = '';

      animeRecommendations.forEach((anime) => {
        const card = createAnimeCard(anime);
        recommendationsGrid.appendChild(card);
      });

      lazyLoadImages();
    })
    .catch((error) => {
      console.error('Error fetching anime recommendations:', error);
    });
}

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img.lazy-load');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            img.classList.add('loaded');
          }
          img.removeAttribute('data-src');
          img.classList.remove('lazy-load');
          obs.unobserve(img);
        }
      });
    },
    {
      rootMargin: '0px 0px 100px 0px',
      threshold: 0.01,
    },
  );

  lazyImages.forEach((img) => {
    observer.observe(img);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  generateRecommendations();
});
