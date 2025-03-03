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

        const img = document.createElement("img");
        img.src = anime.img_url;
        img.alt = anime.title;
        recommendationBox.appendChild(img);

        const title = document.createElement("p");
        title.textContent = anime.title;
        recommendationBox.appendChild(title);

        const playButton = document.createElement("i");
        playButton.classList.add("bx", "bx-play-circle", "play-button");
        recommendationBox.appendChild(playButton);

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