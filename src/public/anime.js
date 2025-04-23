function generateRecentlyUpdated() {
  fetch(`/animes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((recentlyUpdatedAnime) => {
      const recentlyUpdatedGrid = document.getElementById("recently-updated-grid");
      recentlyUpdatedGrid.innerHTML = ""; // Clear existing content

      recentlyUpdatedAnime.forEach((anime) => {
        const recentlyUpdatedBox = document.createElement("div");
        recentlyUpdatedBox.classList.add("recently-updated-box");
        const boxHead = document.createElement("div");
        boxHead.classList.add("box-head");
        const boxContent = document.createElement("div");
        boxContent.classList.add("box-content");
        const boxBody = document.createElement("div");
        boxBody.classList.add("box-body");
        const boxFooter = document.createElement("div");
        boxFooter.classList.add("box-footer");

        const img = document.createElement("img");
        img.src = anime.img_url;
        img.alt = anime.title;
        boxHead.appendChild(img);

        const favoriteButton = document.createElement("i");
        favoriteButton.classList.add("bx", "bx-bookmark", "favorite-btn");
        boxContent.appendChild(favoriteButton);

        const ratingWrapper = document.createElement("div");
        ratingWrapper.classList.add("rating-wrapper");
        const ratingButton = document.createElement("i");
        ratingButton.classList.add("bx", "bx-star", "rating-btn");
        const ratingNum = document.createElement("span");
        ratingNum.classList.add("rating-num");
        ratingNum.textContent = anime.avgRating ? anime.avgRating.toFixed(1) : "0.0";

        ratingButton.addEventListener("click", () => {
          const userId = sessionStorage.getItem("id");
          if (userId !== null) {
            // Store animeId in sessionStorage
            sessionStorage.setItem("selectedAnimeId", anime.id);
            // Redirect to rating page
            window.location.href = "rating.html";
          } else {
            alert("Please log in to rate an anime.");
          }
        });

        ratingWrapper.appendChild(ratingButton);
        ratingWrapper.appendChild(ratingNum);
        boxContent.appendChild(ratingWrapper);

        const playButton = document.createElement("i");
        playButton.classList.add("bx", "bx-play-circle", "play-btn");
        boxContent.appendChild(playButton);

        boxHead.appendChild(boxContent);

        const title = document.createElement("h3");
        title.classList.add("box-title");
        title.textContent = anime.title;
        boxBody.appendChild(title);

        const genre = document.createElement("p");
        genre.classList.add("genre");
        if (anime.genres && Array.isArray(anime.genres)) {
          const genreNames = anime.genres.slice(0, 2);
          genre.textContent = genreNames.join(", ");
        } else {
          genre.textContent = "Unknown";
        }
        boxFooter.appendChild(genre);

        const releaseDate = document.createElement("p");
        releaseDate.classList.add("release-date");
        const date = new Date(anime.date_aired);
        const year = date.getFullYear();
        releaseDate.textContent = `${year}`;
        boxFooter.appendChild(releaseDate);

        boxBody.appendChild(boxFooter);

        recentlyUpdatedBox.appendChild(boxHead);
        recentlyUpdatedBox.appendChild(boxBody);
        recentlyUpdatedGrid.appendChild(recentlyUpdatedBox);
      });
    })
    .catch((error) => {
      console.error("Error fetching recently update anime:", error);
    });
}

function generateGenreOptions() {
  const genreOptions = document.getElementById("genre-options");

  // Fetch genres
  fetch("/genres")
    .then((res) => res.json())
    .then((genres) => {
      genres.forEach((genre) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = genre.name;
        checkbox.name = "genre";
        label.appendChild(checkbox);
        label.append(` ${genre.name}`);
        genreOptions.appendChild(label);
      });
    })
    .catch((err) => console.error("Failed to load genres:", err));
}

document.querySelector(".filter-btn").addEventListener("click", () => {
  const checkedGenres = Array.from(
    document.querySelectorAll("input[name='genre']:checked")
  ).map((cb) => cb.value.toLowerCase());

  if (checkedGenres.length === 1) {
    fetch(`/animes/genre/${checkedGenres[0]}`)
      .then((res) => res.json())
      .then(displayAnimeGrid)
      .catch((err) => console.error("Failed to fetch anime by genre:", err));
  } else {
    // fallback: fetch all or show a message
    alert("Please select only one genre for now.");
  }
});

function displayAnimeGrid(animes) {
  const grid = document.getElementById("recently-updated-grid");
  grid.innerHTML = "";

  animes.forEach((anime) => {
    const box = document.createElement("div");
    box.classList.add("recently-updated-box");

    const boxHead = document.createElement("div");
    boxHead.classList.add("box-head");

    const img = document.createElement("img");
    img.src = anime.img_url;
    img.alt = anime.title;
    boxHead.appendChild(img);

    const boxContent = document.createElement("div");
    boxContent.classList.add("box-content");
    const favoriteButton = document.createElement("i");
    favoriteButton.classList.add("bx", "bx-bookmark", "favorite-btn");
    boxContent.appendChild(favoriteButton);

    const ratingWrapper = document.createElement("div");
    ratingWrapper.classList.add("rating-wrapper");
    const ratingButton = document.createElement("i");
    ratingButton.classList.add("bx", "bx-star", "rating-btn");
    const ratingNum = document.createElement("span");
    ratingNum.classList.add("rating-num");
    ratingNum.textContent = anime.avgRating ? anime.avgRating.toFixed(1) : "0.0";
    ratingButton.addEventListener("click", () => {
      const userId = sessionStorage.getItem("id");
      if (userId !== null) {
        // Store animeId in sessionStorage
        sessionStorage.setItem("selectedAnimeId", anime.id);
        // Redirect to rating page
        window.location.href = "rating.html";
      } else {
        alert("Please log in to rate an anime.");
      }
    });

    ratingWrapper.appendChild(ratingButton);
    ratingWrapper.appendChild(ratingNum);
    boxContent.appendChild(ratingWrapper);

    const playButton = document.createElement("i");
    playButton.classList.add("bx", "bx-play-circle", "play-btn");
    boxContent.appendChild(playButton);

    boxHead.appendChild(boxContent);

    const boxBody = document.createElement("div");
    boxBody.classList.add("box-body");

    const title = document.createElement("h3");
    title.classList.add("box-title");
    title.textContent = anime.title;

    const genre = document.createElement("p");
    genre.classList.add("genre");
    genre.textContent = (anime.genres || []).slice(0, 2).join(", ");

    const releaseDate = document.createElement("p");
    releaseDate.classList.add("release-date");
    releaseDate.textContent = new Date(anime.date_aired).getFullYear();

    const boxFooter = document.createElement("div");
    boxFooter.classList.add("box-footer");
    boxFooter.append(genre, releaseDate);

    boxBody.append(title, boxFooter);
    box.append(boxHead, boxBody);
    grid.appendChild(box);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdown = document.querySelector(".dropdown");
  dropdownToggle.addEventListener("click", () => {
    dropdown.classList.toggle("open");
  });
  generateGenreOptions();
  generateRecentlyUpdated();
});
