const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postRef: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model("Comment", commentSchema);
