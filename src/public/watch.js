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
        const episodeList = document.getElementById("episode-list");
        episodeList.innerHTML = ""; // Clear existing content

        for (let i = 1; i <= anime.total_episodes; i++) {
          const episodeItem = document.createElement("a");
          episodeItem.textContent = i;
          episodeItem.href = "#";

          episodeItem.className = "episode-item";

          episodeList.appendChild(episodeItem);
        }
    })
    .catch((err) => console.error("Failed to load anime:", err));

    loadRecommendedAnimes();
    loadLatestComments(animeId);
});