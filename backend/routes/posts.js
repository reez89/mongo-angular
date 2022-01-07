const express = require('express');

const check = require('../middleware/check-auth');
const extractFile = require('../middleware/multer-file');
const PostController = require('../controllers/post');
const router = express.Router();



router.get(
  '', 
  PostController.getPosts 
);
router.post(
  '',
  check,
  extractFile,
  PostController.createPost
);
router.put(
  '/:id',
  check,
  extractFile,
  PostController.editPost
);
router.get(
  '/:id', 
  PostController.getOnePost
);
router.delete(
  '/:id', 
  check, 
  PostController.deletePost
);

module.exports = router;
