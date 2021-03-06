'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

//get all the likes of an image
const getAllLikesByImageId = async (imageId) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT COUNT(likes) FROM like_db WHERE image_id = ?',
      [imageId]
    );
    return rows[0];
  } catch (error) {
    console.log(error.message);
  }
};

//get 3 images with most liked count order by like count descending
const getAllLikes = async () => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT image_db.image_title, image_db.image_file, like_db.image_id, COUNT(likes) FROM image_db INNER JOIN like_db ON image_db.image_id = like_db.image_id GROUP BY image_id ORDER BY COUNT(likes) DESC LIMIT 3'
    );
    return rows;
  } catch (error) {
    console.log(error.message);
  }
};

//get the like of a user for an image to check if it is liked or not
const getLikeByUserId = async (imageId, userId) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM like_db WHERE image_id = ? AND user_id = ?',
      [imageId, userId]
    );
    return rows;
  } catch (error) {
    console.log(error.message);
  }
};

//for inserting a like
const insertLike = async (imageId, userId) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO like_db (likes, user_id, image_id) VALUES(?, ?, ?)',
      [1, userId, imageId]
    );
    return rows.affectedRows === 1;
  } catch (error) {
    console.log(error);
  }
};

//for unliking an image
const deleteLikeByImageId = async (imageId, userId) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM like_db WHERE image_id = ? AND user_id = ?',
      [imageId, userId]
    );

    if (rows.affectedRows === 1) return true;
    return false;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllLikesByImageId,
  getLikeByUserId,
  insertLike,
  deleteLikeByImageId,
  getAllLikes,
};
