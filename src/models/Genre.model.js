const prisma = require("./prismaClient");

module.exports.getAllGenres = function getAllGenres() {
    return prisma.genre.findMany({}).then((genres) => {
        console.log("All Genres:", genres)
        return genres;
    });
};