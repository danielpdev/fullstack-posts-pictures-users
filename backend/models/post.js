const mongoose = require("mongoose");
const Comment = require("./comment");

const postSchema = mongoose.Schema({
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{type: String, required: true }],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
  dateTaken: { type: Date, required: true },
  location: { type: String, required: true },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating"}]
});

postSchema.pre('deleteOne', { query: true, document: true }, function(next) {
  const id = this.getQuery()["_id"];
  mongoose.model("Comment").deleteMany({ postRef: id }, function(err, result) {
    if (err) {
      next(err);
    } else {
      mongoose.model("Rating").deleteMany({ postId: id }, function(err, result) {
        if (err) {
          next(err);
        } else {
          next();
        }
      });
    }
  });
});

module.exports = mongoose.model("Post", postSchema);
