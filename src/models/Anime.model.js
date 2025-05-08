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

  let genresData;

  if (data.genres) {
    const genreNames = Array.isArray(data.genres) ? data.genres : [data.genres];
    const genreRecords = await prisma.genre.findMany({
      where: {
        name: { in: genreNames },
      },
    });

    genresData = {
      set: genreRecords.map((genre) => ({
        genreId_animeId: {
          genreId: genre.id,
          animeId: id,
        },
      })),
    };

    delete data.genres;
  }

  return prisma.anime.update({
    where: {id},
    data: {
      ...data,
      ...(genresData && { genres: genresData }),
    }
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

module.exports.createAnime = async function createAnime(data, imageUrl) {
  const {
    title,
    description,
    duration = 24,
    type,
    studios,
    date_aired,
    status,
    genres = [],
  } = data;

  const createdAnime = await prisma.anime.create({
    data: {
      title,
      description,
      duration: Number(duration),
      type,
      studios,
      date_aired: new Date(date_aired),
      status,
      img_url: imageUrl,
      genres: {
        create: genres.map((genreName) => ({
          genre: {
            connect: { name: genreName },
          },
        })),
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

  return {
    ...createdAnime,
    genres: createdAnime.genres.map((g) => g.genre.name),
  };
};

module.exports.deleteAnime = async function deleteAnime(id) {
  return prisma.anime.delete({where: {id}});
}

module.exports.getAnimeByStatus = async function getAnimeByStatus(status) {
  const animes = await prisma.anime.findMany({
    where: {
      status: {
        equals: status,
        mode: "insensitive",
      },
    },
    orderBy: {
      date_aired: "desc",
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

module.exports.getFilteredAnimes = async function getFilteredAnimes(filters) {
  const { genreList, yearList, type, status } = filters;

  const where = {
    ...(type && { type }),
    ...(status && { status: { equals: status, mode: "insensitive" } }),
    ...(yearList.length > 0 && {
      OR: yearList.map((y) => ({
        date_aired: {
          gte: new Date(`${y}-01-01`),
          lt: new Date(`${y + 1}-01-01`),
        },
      })),
    }),
    ...(genreList.length > 0 && {
      genres: {
        some: {
          genre: {
            name: {
              in: genreList,
              mode: "insensitive",
            },
          },
        },
      },
    }),
  };

  const animes = await prisma.anime.findMany({
    where,
    orderBy: {
      date_aired: "desc",
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