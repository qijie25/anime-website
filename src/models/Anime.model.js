const prisma = require("./prismaClient");

function formatAnimeGenres(animes) {
  return animes.map((anime) => ({
    ...anime,
    genres: anime.genres.map((g) => g.genre.name),
  }));
}

module.exports.getAllAnimes = async function getAllAnimes() {
  const animes = await prisma.anime.findMany({
    orderBy: {
      created_at: "asc",
    },
    include: {
      ratings: {
        include: {
          anime: true,
        },
      },
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  return formatAnimeGenres(animes);
};

module.exports.getAnimeById = async function getAnimeById(id) {
  const anime = await prisma.anime.findUnique({
    where: {
      id: parseInt(id, 10),
    },
    include: {
      ratings: {
        include: {
          anime: true,
        },
      },
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  if (!anime) return null;

  return {
    ...anime,
    genres: anime.genres.map((g) => g.genre.name),
  };
};

module.exports.getAnimeByGenre = async function getAnimeByGenre(genreName) {
  const animes = await prisma.anime.findMany({
    where: {
      genres: {
        some: {
          genre: {
            is: {
              name: {
                equals: genreName,
                mode: "insensitive",
              },
            },
          },
        },
      },
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  return formatAnimeGenres(animes);
};

module.exports.updateAnime = async function updateAnime(id, data) {
  const anime = await prisma.anime.findUnique({where: {id} });

  if (!anime) {
    throw new Error("Anime not found");
  }

  return prisma.anime.update({
    where: {id},
    data,
  });
};

module.exports.getAnimeByQuery = async function getAnimeByQuery(query) {
  const animes = await prisma.anime.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          genres: {
            some: {
              genre: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  return formatAnimeGenres(animes);
}