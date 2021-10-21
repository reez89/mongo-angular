const express = require('express');
const multer = require('multer');
const Post = require('../models/post');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images'); //fa riferimento al server e non al posts.js
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  },
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let posts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .find()
    .then((documents) => {
      posts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched',
        posts: posts,
        maxPosts: count,
      });
    });
});

router.post(
  '',
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        message: 'Post created',
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    });
  }
);

router.put(
  '/:id',
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });

    console.log(post);
    Post.updateOne(
      {
        _id: req.params.id,
      },
      post
    )
      .exec()
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: 'Modifica compeltata' });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.satus(404).json({ message: 'Post not found!' });
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
  }).then((result) => {
    console.log(result);
    res
      .status(200)
      .json({ message: `Post with id ${req.params.id} number deleted!` });
  });
});

module.exports = router;
