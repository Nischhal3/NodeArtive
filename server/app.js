'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

//Force redirection from http to https on server
app.enable('trust proxy');
app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    const proxypath = process.env.PROXY_PASS || ''
    res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const passport = require('./utils/passport');
const authRoute = require('./routes/authRoute.js');
const userRoute = require('./routes/userRoute');
const imageCollectionRoute = require('./routes/imageCollectionRoute');
const collectionRoute = require('./routes/collectionRoute');
const imageUserRoute = require('./routes/imageUserRoute');
const allCommentsRoute = require('./routes/allCommentsRoute');
const commentRoute = require('./routes/commentRoute');
const allLikesRoute = require('./routes/allLikesRoute');
const likeRoute = require('./routes/likeRoute');

app.use(passport.initialize());
app.use(express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails'));

/* We have diffirent routes for image, comment and like 
since we do the get function without authentication but not post/put and delete */
app.use('/auth', authRoute);
app.use('/collection', collectionRoute);
app.use('/image/collection', imageCollectionRoute);
app.use('/like/image', allLikesRoute);
app.use('/comments/image', allCommentsRoute);

//Routes with authentication
app.use(
  '/image/user',
  passport.authenticate('jwt', { session: false }),
  imageUserRoute
);

app.use('/user', passport.authenticate('jwt', { session: false }), userRoute);
app.use(
  '/image/comment',
  passport.authenticate('jwt', { session: false }),
  commentRoute
);
app.use(
  '/like/user',
  passport.authenticate('jwt', { session: false }),
  likeRoute
);

//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'internal error' });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
