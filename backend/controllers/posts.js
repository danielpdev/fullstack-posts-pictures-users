const Comment = require("../models/comment");
const Rating = require('../models/rating');
const Post = require("../models/post");
const utils = require("../utils");

exports.createPost = (req, res, next) => {
  const tags = req.body.tags && req.body.tags.split(';');
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    description: req.body.description,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
    tags: tags,
    location: req.body.location,
    dateTaken: req.body.dateTaken,
  });

  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.updatePost = (req, res, next) => {
  const tags = req.body.tags && req.body.tags.split(';');

  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    description: req.body.description,
    imagePath: imagePath,
    creator: req.userData.userId,
    tags,
    location: req.body.location,
    dateTaken: req.body.dateTaken
  });
  Post.find({ _id: req.body.id }).then((oldPost) => {
    post.comments = oldPost.comments;
    post.ratings = oldPost.ratings;
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Couldn't udpate post!"
        });
      });
  }).catch(error => {
    res.status(500).json({
      message: "Couldn't udpate post!"
    });
  });

};

exports.ratePost = (req, res, next) => {
  Post.findOne({ _id: req.body.id }).populate('ratings')
    .then(post => {
      const oldRating = post.ratings.find(rating => rating.ratedBy.toString() === req.userData.userId.toString());
      if (!oldRating) {
        const rating = new Rating({
          ratedBy: req.userData.userId,
          postId: req.params.id,
          stars: req.body.stars
        }).save().then((createdRating) => {
          post.ratings.push(createdRating._id);
          post.save().then((updatedPost) => {
            post.ratings.pop();
            const searchedRating = updatedPost.ratings.find(rating => rating._id === createdRating._id);
            if (!searchedRating) {
              updatedPost.ratings.push(createdRating);
            }
            res.status(200).json({
              post: updatedPost,
            });
          });

        });
      } else {
        oldRating.stars = req.body.stars;
        oldRating.save().then((updatedRating) => {
          res.status(200).json({
            post
          });
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let postQuery;
  let queryFields = [];
  let sortFields = {};
  const searchQuery = {};//tags, description, location , date
  if (req.query.searchQuery && req.query.searchQuery !== undefined
    && req.query.searchQuery !== 'undefined') {
    queryFields = utils.getQueryFields(req.query.searchQuery);
  }
  if (req.query.sortFilter && req.query.sortFilter !== undefined
    && req.query.sortFilter !== 'undefined') {
    sortFields = utils.getSortFields(req.query.sortFilter)
  }
  if (searchQuery) {
    postQuery = Post.find(queryFields.length ? { $or: [...queryFields] } : {}).sort(sortFields);
  } else
    postQuery = Post.find(sortFields || sortFields);

  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      const postsCount = Post.countDocuments();
      return queryFields.length > 0 ? fetchedPosts.length : postsCount;
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).populate('comments').populate('ratings')
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};
