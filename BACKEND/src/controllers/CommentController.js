const Comment = require("../models/CommentModel");
const {User,TempUser} = require("../models/UserModel");
const mongoose = require("mongoose");

// 📌 Fetch Comments
exports.getComments = async (req, res) => {
  try {
    const productId = req.query.productId;
    const commentList = await Comment.findOne({ productId });

    if (!commentList || commentList.comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this product." });
    }

    return res.status(200).json(commentList);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res.status(500).json({ message: "Server error while fetching comments." });
  }
};

// 📌 Add a Comment
exports.addComment = async (req, res) => {
  try {
    const productId = req.query.productId;
    const { commentText } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({ message: "User must be logged in before comment on any product." });
    }

    if (!commentText || commentText.trim() === "") {
      return res.status(400).json({ message: "Comment text is required." });
    }

    let productComment = await Comment.findOne({ productId });

    if (!productComment) {
      productComment = new Comment({
        productId,
        comments: [{ userName: user.name, comment: commentText }],
      });
    } else {
      productComment.comments.push({ userName: user.name, comment: commentText });
    }

    await productComment.save();
    res.status(201).json({ message: "Comment added successfully!" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error while adding comment." });
  }
};
