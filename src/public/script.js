const helpIcon = document.getElementById("helpIcon");
const helpModal = document.querySelector(".help-modal");
const closeBtn = document.querySelector(".close-btn");

helpIcon.addEventListener("click", () => {
  helpModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  helpModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === helpModal) {
    helpModal.style.display = "none";
  }
});

function generateRecommendations() {
  fetch(`/animes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((animeRecommendations) => {
      const recommendationsGrid = document.getElementById(
        "recommendations-grid"
      );
      recommendationsGrid.innerHTML = ""; // Clear existing content

      animeRecommendations.forEach((anime) => {
        const recommendationBox = document.createElement("div");
        recommendationBox.classList.add("recommendation-box");
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
        ratingNum.textContent = anime.avgRating
          ? anime.avgRating.toFixed(1)
          : "0.0";

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

        recommendationBox.appendChild(boxHead);
        recommendationBox.appendChild(boxBody);
        recommendationsGrid.appendChild(recommendationBox);
      });
    })
    .catch((error) => {
      console.error("Error fetching anime recommendations:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  generateRecommendations();
});
