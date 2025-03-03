const prisma = require("./prismaClient");

module.exports.getAllAnimes = async function getAllAnimes() {
    return prisma.anime.findMany({
        orderBy: {
            created_at: "asc",
        },
    })
    .then((animes) => {
        return animes;
    });
}

module.exports.getAnimeById = async function getAnimeById(id) {
    return prisma.anime.findMany({
        where: {
            id: parseInt(id, 10),
        },
        orderBy: {
            created_at: "asc",
        },
    })
    .then((animes) => {
        return animes;
    });
};