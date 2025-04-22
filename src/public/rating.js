document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".rating-stars i");
  const animeId = sessionStorage.getItem("selectedAnimeId");
  const userId = sessionStorage.getItem("id");

  if (!animeId || !userId) {
    alert("Missing anime or user info. Please go back and try again.");
    return;
  }

  let selectedRating = 0;

  // Highlight stars up to the one hovered or clicked
  function highlightStars(index) {
    stars.forEach((star, i) => {
      if (i <= index) {
        star.classList.add("highlighted");
      } else {
        star.classList.remove("highlighted");
      }
    });
  }

  stars.forEach((star, index) => {
    star.addEventListener("mouseover", () => highlightStars(index));
    star.addEventListener("mouseout", () => highlightStars(selectedRating - 1));

    star.addEventListener("click", () => {
      selectedRating = (index + 1) * 2; // 1 star = 2 points, 5 stars = 10
      highlightStars(index);

      // Send rating to the server
      fetch("http://localhost:3000/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animeId: parseInt(animeId),
          userId: parseInt(userId),
          score: selectedRating,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(`Thanks for rating! Current Avg: ${data.avgRating.toFixed(1)} from ${data.totalRatings} ratings.`);
        })
        .catch((err) => {
          console.error("Rating failed:", err);
          alert("Something went wrong while submitting your rating.");
        });
    });
  });

  const resultDisplay = document.getElementById("result");

  // Fetch anime details and user's previous rating
  Promise.all([
    fetch(`http://localhost:3000/animes/${animeId}`).then((res) => res.json()),
    fetch(`http://localhost:3000/ratings/${userId}/${animeId}`).then((res) => res.json()),
  ])
    .then(([anime, rating]) => {
      if (rating && rating.score) {
        const previousScore = rating.score;
        const starIndex = previousScore / 2 - 1;
        highlightStars(starIndex); // Visually highlight the user's previous rating
        selectedRating = previousScore;

        resultDisplay.textContent = `You have rated "${anime.title}" ${previousScore} out of 10 previously.`;
      } else {
        resultDisplay.textContent = `You haven't rated "${anime.title}" yet.`;
      }
    })
    .catch((err) => {
      console.error("Error loading anime or rating data:", err);
      resultDisplay.textContent = "Failed to load previous rating.";
    });
});
