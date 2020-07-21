const Comment = require("../models/comment");
const Post = require("../models/post");

exports.createComment = (req, res, next) => {
  const comment = new Comment({
    name: req.body.name,
    content: req.body.content,
    postedBy: req.userData.userId,
    email: req.body.email,
    postRef: req.body.postId
  });
  comment
    .save()
    .then(createdComment => {
      Post.findById(req.body.postId).then((post) => {
        post.comments.push(createdComment._id);
        post.save().then(() => {
          res.status(201).json({
            message: "Created added successfully",
            comment
          });
        });
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a comment failed!"
      });
    });
};
