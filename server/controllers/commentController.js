'use strict';

const {
  getComments,
  insertComment,
  deleteCommentFromDb,
} = require('../models/commentModel');
const { badRequestError, unauthenticatedError } = require('../utils/error');

//get all the comments for 1 image
const getAllComments = async (req, res) => {
  const rows = await getComments(req.params.id);
  res.json(rows);
};

//add a comment for 1 image
const addComment = async (req, res, next) => {
  req.body.id = req.params.id;
  const user_id = req.user.user_id;
  const allComments = await insertComment(req.body, user_id, next);
  res.json(allComments);
};

//delete comment
const deleteComment = async (req, res, next) => {
  const id = req.params.id;
  const result = await deleteCommentFromDb(id, req.user);

  if (!result) next(unauthenticatedError());

  if (result) {
    res.json({ message: 'Comment has been deleted' });
    return;
  }

  next(badRequestError('Error deleting comment'));
};

module.exports = {
  getAllComments,
  addComment,
  deleteComment,
};
