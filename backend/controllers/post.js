const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
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
      }) 
      .catch((err) => {
        res.status(500).json(
          { message: 'Could not load posts, check your server settings !'})
      });
}

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        message: 'Post created',
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Error creating post'
      })
    })
}

exports.editPost = (req, res, next) => {
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
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id,creator: req.userData.userId},post)
        .exec()
        .then((result) => {
            if (result.matchedCount > 0){
                res.status(200).json({ message: 'Update Successful!'})
            }else {
                res.status(401).json({ message: 'Update Failed!No Auth!' });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: 'Could not update post !'})
        });
}

exports.getOnePost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.satus(404).json({ message: 'Post not found!' });
        }
    })
    .catch(error =>{
        res.status(500).json({ message : 'Error, post not found'})
    })
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId
    }).then(result => {
        if (result.deletedCount > 0){
            res.status(200).json({ message: 'Delete Successful!'})
        }else {
            res.status(401).json({ message: 'Delete Failed!No Auth!' });
        }
    })
    .catch(error =>{
        res.status(500).json({ message : 'A technical error occured'})
    })
}