const express = require('express');
const createError = require('http-errors');
const session = require('express-session');
// require("dotenv").config();

const userRouter = require('./routers/User.router');
const animeRouter = require('./routers/Anime.router');
const genreRouter = require('./routers/Genre.router');
const messageRouter = require('./routers/Message.router');
const messageLikeRouter = require('./routers/MessageLike.router');
const messageReportRouter = require('./routers/MessageReport.router');
const ratingRouter = require('./routers/Rating.router');
const adminRouter = require('./routers/Admin.router');

const path = require('path');
const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
    },
  }),
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin-assets', express.static(path.join(__dirname, 'protected')));
app.use('/users', userRouter);
app.use('/animes', animeRouter);
app.use('/genres', genreRouter);
app.use('/messages', messageRouter);
app.use('/messagesLikes', messageLikeRouter);
app.use('/messagesReport', messageReportRouter);
app.use('/ratings', ratingRouter);
app.use('/admin', adminRouter);

app.use((req, res, next) => {
  next(createError(404, `Unknown resource ${req.method} ${req.originalUrl}`));
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error.message || 'Unknown Server Error!' });
});

module.exports = app;
