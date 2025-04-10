const apiUrl = "http://localhost:3000";

function generateRecommendations() {
  fetch(`${apiUrl}/animes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((animeRecommendations) => {
      const recommendationsGrid = document.getElementById("recommendations-grid");
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

        const ratingButton = document.createElement("i");
        ratingButton.classList.add("bx", "bx-star", "rating-btn");
        boxContent.appendChild(ratingButton);

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
        genre.textContent = `${anime.genre}`;
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


// document.querySelector('.join-btn').addEventListener('click', () => {
//     alert('Welcome to the AniTube community!');
// });

document.addEventListener('DOMContentLoaded', () => {
    generateRecommendations();
});