'use strict';

const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const {
  get_image,
  post_image,
  delete_image,
  update_image,
  get_image_user,
} = require('../controllers/imageController');
const router = express.Router();

//checking for image file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ dest: './uploads/', fileFilter });

router
  .route('/:id')
  .get(get_image_user)
  .post(
    upload.single('image'),
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('date').isDate(),
    post_image
  )
  .put(
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('date').notEmpty(),
    body('collection').notEmpty(),
    update_image
  )
  .delete(delete_image);

module.exports = router;
