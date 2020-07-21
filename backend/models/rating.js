const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  stars: { type: Number, required: true },
});

module.exports = mongoose.model("Rating", ratingSchema);
