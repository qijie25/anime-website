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

// module.exports.getAnimeByQuery = async function getAnimeByQuery({query, type, status, limit = null}) {
//   if (!query || query.trim() === "") {
//     return [];
//   }

//   const whereClause = {
//     AND: [
//       {
//         OR: [
//           {
//             title: {
//               contains: query,
//               mode: "insensitive",
//             },
//           },
//           {
//             description: {
//               contains: query,
//               mode: "insensitive",
//             },
//           },
//           {
//             genres: {
//               some: {
//                 genre: {
//                   name: {
//                     contains: query,
//                     mode: "insensitive",
//                   },
//                 },
//               },
//             },
//           },
//         ],
//       },
//       ...(type ? [{ type: { equals: type, mode: "insensitive" } }] : []),
//       ...(status ? [{ status: { equals: status, mode: "insensitive" } }] : []),
//     ],
//   };

//   const animes = await prisma.anime.findMany({
//     where: whereClause,
//     include: {
//       genres: {
//         include: {
//           genre: true,
//         },
//       },
//     },
//   });

//   // Custom relevance scoring
//   const scoredAnimes = animes.map((anime) => {
//     let score = 0;
//     const q = query.toLowerCase();

//     if (anime.title.toLowerCase() === q) score += 100; // exact match
//     else if (anime.title.toLowerCase().includes(q)) score += 50;

//     if (anime.description?.toLowerCase().includes(q)) score += 10;

//     const genreMatch = anime.genres.some((g) =>
//       g.genre.name.toLowerCase().includes(q)
//     );
//     if (genreMatch) score += 20;

//     return { ...anime, relevanceScore: score };
//   });

//   scoredAnimes.sort((a, b) => b.relevanceScore - a.relevanceScore);

//   const result = limit ? scoredAnimes.slice(0, limit) : scoredAnimes;
//   return formatAnimeGenres(result);
// };

module.exports.getAnimeByQuery = async function getAnimeByQuery({query, type, status, limit = null}) {
  if (!query || query.trim() === "") {
    return [];
  }

  const queryText = query.trim();

  // Prepare WHERE clauses for type and status filters
  const conditions = [];
  const values = [queryText];
  let paramIndex = 2;

  if (type) {
    conditions.push(`"type" ILIKE $${paramIndex++}`);
    values.push(type);
  }

  if (status) {
    conditions.push(`"status" ILIKE $${paramIndex++}`);
    values.push(status);
  }

  const whereClause = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";

  // Run full-text search on search_vector
  const rawAnimes = await prisma.$queryRawUnsafe(
    `
    SELECT "id", ts_rank("search_vector", plainto_tsquery('english', $1)) AS rank
    FROM "Anime"
    WHERE "search_vector" @@ plainto_tsquery('english', $1)
    ${whereClause}
    ORDER BY rank DESC
    ${limit ? `LIMIT ${limit}` : ""}
    `,
    ...values
  );

  if (!rawAnimes.length) return [];

  // Fetch full anime info with genres
  const animeIds = rawAnimes.map((row) => row.id);

  const fullAnimes = await prisma.anime.findMany({
    where: {
      id: { in: animeIds },
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  // Map rank scores back to results
  const animeRankMap = new Map(rawAnimes.map((a) => [a.id, a.rank]));
  const scoredResults = fullAnimes.map((anime) => ({
    ...anime,
    relevanceScore: animeRankMap.get(anime.id) || 0,
  }));

  // Sort again to guarantee order
  scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return formatAnimeGenres(scoredResults);
};

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

  const potentialAnimes = await prisma.anime.findMany({
    where,
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
    orderBy: {
      date_aired: "desc",
    },
  });

  // Filter to only include animes that contain ALL selected genres
  const finalAnimes =
    genreList.length > 0
      ? potentialAnimes.filter((anime) => {
          const animeGenres = anime.genres.map((ag) =>
            ag.genre.name.toLowerCase()
          );
          return genreList.every((g) => animeGenres.includes(g));
        })
      : potentialAnimes;

  return formatAnimeGenres(finalAnimes);
};

module.exports.getTopRatedAnimes = async function getTopRatedAnimes(
  limit = 10
) {
  const animes = await prisma.anime.findMany({
    orderBy: {
      avgRating: "desc",
    },
    take: limit,
    where: {
      avgRating: {
        not: null,
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