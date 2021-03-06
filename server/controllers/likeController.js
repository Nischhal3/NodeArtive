'use strict';

const {
  getAllLikes,
  getAllLikesByImageId,
  insertLike,
  deleteLikeByImageId,
  getLikeByUserId,
} = require('../models/likeModel');
const { badRequestError, internalServerError } = require('../utils/error');

//get all the likes of an image
const getAllLikesByImage = async (req, res, next) => {
  const rows = await getAllLikesByImageId(req.params.id);
  if (rows) {
    res.json({ allLikes: rows['COUNT(likes)'] });
    return;
  }
  next(internalServerError());
};

//get and arrange the top 3 most-liked image
const get_all_like = async (req, res, next) => {
  const rows = await getAllLikes();
  if (rows) {
    res.json({ rows });
    return;
  }
  next(internalServerError());
};

//check if user has liked the image or not
const getLike = async (req, res, next) => {
  const rows = await getLikeByUserId(req.params.id, req.user.user_id);

  if (rows.length > 0) {
    res.json({ like: rows[0].likes });
    return;
  }

  if (rows.length === 0) {
    res.json({ like: 0 });
    return;
  }

  next(internalServerError());
};

//insert a like
const addLike = async (req, res, next) => {
  const isAdded = await insertLike(req.params.id, req.user.user_id);

  if (isAdded) {
    res.sendStatus(200);
    return;
  }

  next(badRequestError('You can only like once'));
};

//unlike an image
const deleteLike = async (req, res, next) => {
  const isDeleted = await deleteLikeByImageId(req.params.id, req.user.user_id);

  if (isDeleted) {
    res.sendStatus(200);
    return;
  }

  if (!isDeleted) {
    next(badRequestError('You can not unlike artwork anymore.'));
  }

  next(internalServerError());
};

module.exports = {
  get_all_like,
  getAllLikesByImage,
  getLike,
  addLike,
  deleteLike,
};
