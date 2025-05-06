const sideLogout = document.getElementById("side-logout");

sideLogout.addEventListener("click", function () {
  sessionStorage.clear();
  window.location.href = "/signin.html";
});

async function fetchAndDisplayAnimes() {
  const tableBody = document.getElementById("anime-table-body");
  const template = document.getElementById("anime-table-template");

  tableBody.innerHTML = ""; // Clear existing table rows

  try {
    const response = await fetch("/animes");
    if (!response.ok) throw new Error("Failed to fetch anime data");

    const animes = await response.json();

    animes.forEach((anime) => {
      const clone = template.content.cloneNode(true);
      const img = anime.img_url
      clone.querySelector("img").src = img.startsWith("http") ? img : "/" + img;
      clone.querySelector(".td-anime-title").textContent = anime.title;
      clone.querySelector(".td-anime-genre").textContent = anime.genres.join(", ");
      clone.querySelector(".td-anime-rating").textContent = anime.avgRating?.toFixed(1) || "N/A";
      clone.querySelector(".td-anime-studio").textContent = anime.studios;
      clone.querySelector(".td-anime-status").textContent = anime.status;

      const editLink = clone.querySelector(".td-anime-actions a");
      const deleteLink = clone.querySelector(".delete-icon");
      editLink.href = `/admin/edit-anime?id=${anime.id}`;
      deleteLink.addEventListener("click", () => {
        if (confirm(`Are you sure you want to delete "${anime.title}"?`)) {
          deleteAnime(anime.id);
        }
      });

      tableBody.appendChild(clone);
    });
  } catch (error) {
    console.error("Error loading animes:", error);
  }
}

const btnAddAdmin = document.getElementById("btn-add-anime");

btnAddAdmin.addEventListener("click", () => {
  openAddAnimeModal();
  loadGenres();
});

function openAddAnimeModal() {
  document.getElementById("addAnimeModal").style.display = "block";
}

document.querySelector(".close-btn").onclick = () => {
  document.getElementById("addAnimeModal").style.display = "none";
};

window.onclick = (event) => {
  if (event.target === document.getElementById("replyModal")) {
    document.getElementById("addAnimeModal").style.display = "none";
  }
};

async function loadGenres() {
  try {
    const res = await fetch("/genres");
    const genres = await res.json();

    const genreSelect = document.getElementById("animeGenre");

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.name;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load genres:", err);
  }
}

function deleteAnime(id) {
  fetch(`/animes/${id}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        alert("Anime deleted!");
        fetchAndDisplayAnimes();
      } else {
        console.error("Failed to delete the anime.");
      }
    })
    .catch((error) => console.error("Error deleting anime:", error));
}

document.getElementById("submitAddAnime").addEventListener("click", async () => {
    const formData = new FormData();
    const title = document.getElementById("animeTitle").value;
    const description = document.getElementById("animeDescription").value;
    const type = document.getElementById("animeType").value;
    const studios = document.getElementById("animeStudio").value;
    const date_aired = document.getElementById("animeReleaseDate").value;
    const status = document.getElementById("animeStatus").value;
    const genreSelect = document.getElementById("animeGenre");
    const selectedGenres = Array.from(genreSelect.selectedOptions).map((opt) => opt.value);
    selectedGenres.forEach((genre) => formData.append("genres", genre));
    const imgInput = document.getElementById("animeImage");
    const file = imgInput.files[0];

    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("studios", studios);
    formData.append("date_aired", date_aired);
    formData.append("status", status);
    if (file) formData.append("image", file);

    try {
      const response = await fetch("/animes", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add anime");

      alert("Anime added!");
      document.getElementById("addAnimeModal").style.display = "none";
      fetchAndDisplayAnimes();
    } catch (err) {
      console.error(err);
      alert("Error adding anime.");
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = sessionStorage.getItem("isAdmin");
  if (isAdmin !== "true") {
    window.location.href = "/index.html";
    return;
  }

  fetchAndDisplayAnimes();
});
