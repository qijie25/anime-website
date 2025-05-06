const prisma = require("../models/prismaClient");

const ensureAdmin = (req, res, next) => {
    const user = req.session.user;
    if (user && user.isAdmin) {
      return next();
    }

    if (!user) {
      return res.redirect("/signin.html");
    }

    // Logged in but not admin
    return res.redirect("/index.html");
};

module.exports = { ensureAdmin };