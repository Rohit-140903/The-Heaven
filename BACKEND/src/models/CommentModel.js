const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  productId: String,
  comments: [
    {
      userName: { type: String, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
