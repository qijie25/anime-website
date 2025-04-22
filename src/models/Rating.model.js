const prisma = require("./prismaClient");

module.exports.createRating = async function createRating(animeId, userId, score) {
  // Upsert user rating
  await prisma.rating.upsert({
    where: {
      animeId_userId: {
        animeId,
        userId,
      },
    },
    update: { score },
    create: {
      animeId,
      userId,
      score,
    },
  });

  // Recalculate avg and total ratings
  const ratings = await prisma.rating.findMany({
    where: { animeId },
    select: { score: true },
  });

  const totalRatings = ratings.length;
  const avgRating = ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings;

  // Update Anime table
  await prisma.anime.update({
    where: { id: animeId },
    data: {
      avgRating,
      totalRatings,
    },
  });

  return { avgRating, totalRatings };
};

module.exports.getRatingByAnimeId = async function getRatingByAnimeId(animeId) {
  const anime = await prisma.anime.findUnique({
    where: { id: animeId },
    select: {
      avgRating: true,
      totalRatings: true,
    },
  });

  if (!anime) throw new Error("Anime not found");

  return anime;
};

module.exports.getUserRatingForAnime = async function getUserRatingForAnime(
  userId,
  animeId
) {
  const rating = await prisma.rating.findUnique({
    where: {
      animeId_userId: {
        animeId,
        userId,
      },
    },
    select: {
      score: true,
    },
  });

  return rating; // Will return null if not found
};
