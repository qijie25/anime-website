function loadRecommendedAnimes() {
    fetch(`/animes/top-rated`)
    .then((res) => res.json())
    .then((animes) => {
        const recommendedList = document.getElementById("recommended-list");
        const template = document.getElementById("recommendation-template");
        recommendedList.innerHTML = "";
        animes.forEach((anime) => {
            const clone = template.content.cloneNode(true);
            const recommendedItem = clone.querySelector(".recommendation");
            const img = clone.querySelector(".recommendation-img");
            img.src = anime.img_url;
            const title = clone.querySelector(".recommendation-title");
            title.textContent = anime.title;
            const scores = clone.querySelector(".recommendation-scores");
            scores.textContent = `${anime.avgRating?.toFixed(1) ?? "0.0"} ★`;
            recommendedItem.href = `/watch.html?id=${anime.id}`;
            recommendedList.appendChild(clone);
        })
    })
}

function loadLatestComments(animeId) {
  fetch(`/messages/latest/${animeId}`)
    .then((res) => res.json())
    .then((messages) => {
      const commentList = document.querySelector(".comment-list");
      const template = document.getElementById("comment-template");
      commentList.innerHTML = "";

      messages.forEach((message) => {
        const clone = template.content.cloneNode(true);

        const avatarImg = clone.querySelector(".comment-avatar img");
        const name = clone.querySelector(".comment-name");
        const text = clone.querySelector(".comment-text");
        const time = clone.querySelector(".comment-time");

        avatarImg.src = message.user.profile_imgs?.[0] || "./assets/profile-icon.png";
        name.textContent = message.user.username;
        text.textContent = message.text;
        time.textContent = new Date(message.created_at).toLocaleString();

        commentList.appendChild(clone);
      });
    })
    .catch((err) => console.error("Failed to load comments:", err));
}

document.querySelector(".comment-box button").addEventListener("click", () => {
  const textarea = document.querySelector(".comment-box textarea");
  const text = textarea.value.trim();
  const animeId = new URLSearchParams(window.location.search).get("id");

  if (!text) return;

  fetch("/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, anime_id: parseInt(animeId) }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to post message");
      textarea.value = "";
      loadLatestComments(animeId);
    })
    .catch((err) => console.error(err));
});

document.addEventListener("DOMContentLoaded", () => {
    const param = new URLSearchParams(window.location.search);
    const animeId = param.get("id");

    fetch(`/animes/${animeId}`)
    .then((res) => res.json())
    .then((anime) => {
        document.getElementById("anime-img").src = anime.img_url;
        document.getElementById("anime-title").textContent = anime.title;
        document.getElementById("anime-rating").textContent = `${anime.avgRating?.toFixed(1) ?? "0.0"} of ${anime.totalRatings}`;
        document.getElementById("anime-type").textContent = anime.type;
        document.getElementById("anime-status").textContent = anime.status;
        document.getElementById("anime-episodes").textContent = anime.total_episodes;
        document.getElementById("anime-duration").textContent = anime.duration + " min/ep";
        document.getElementById("anime-genres").textContent = anime.genres.join(", ");
        document.getElementById("anime-release-date").textContent = new Date(anime.date_aired).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
        document.getElementById("anime-studios").textContent = anime.studios;
        document.getElementById("anime-scores").textContent = `${anime.avgRating?.toFixed(1) ?? "0.0"} ★`;
        document.getElementById("anime-description").textContent = anime.description;
        const ratingStars = document.querySelector(".rating-stars");
        ratingStars.addEventListener("click", (e) => {
          const userId = sessionStorage.getItem("id");
          if (userId !== null) {
            sessionStorage.setItem("selectedAnimeId", anime.id);
            window.location.href = "rating.html";
          } else {
            alert("Please log in to rate an anime.");
          }
        });
        const episodeList = document.getElementById("episode-list");
        const pagination = document.getElementById("episode-pagination");

        const EPISODES_PER_PAGE = 100;
        const totalPages = Math.ceil(anime.total_episodes / EPISODES_PER_PAGE);
        let currentPage = 1;

        function renderEpisodes(page) {
          episodeList.innerHTML = "";
          const start = (page - 1) * EPISODES_PER_PAGE + 1;
          const end = Math.min(start + EPISODES_PER_PAGE - 1, anime.total_episodes);

          for (let i = start; i <= end; i++) {
            const episodeItem = document.createElement("a");
            episodeItem.textContent = i.toString().padStart(3, "0");
            episodeItem.href = "#";
            episodeItem.className = "episode-item";
            episodeList.appendChild(episodeItem);
          }
        }

        function renderPagination() {
          pagination.innerHTML = "";

          if (anime.total_episodes <= EPISODES_PER_PAGE) return;

          for (let i = 1; i <= totalPages; i++) {
            const start = (i - 1) * EPISODES_PER_PAGE + 1;
            const end = Math.min(i * EPISODES_PER_PAGE, anime.total_episodes);
            const btn = document.createElement("button");
            btn.textContent = `${start.toString().padStart(3, "0")}–${end.toString().padStart(3, "0")}`;
            btn.classList.toggle("active", i === currentPage);

            btn.addEventListener("click", () => {
              currentPage = i;
              renderEpisodes(currentPage);
              renderPagination(); // re-render to update active class
            });

            pagination.appendChild(btn);
          }
        }

        renderEpisodes(currentPage);
        renderPagination();
    })
    .catch((err) => console.error("Failed to load anime:", err));

    loadRecommendedAnimes();
    loadLatestComments(animeId);
});