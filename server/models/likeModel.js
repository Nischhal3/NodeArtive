'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

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
};