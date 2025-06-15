const express = require("express");
const { getComments, addComment } = require("../controllers/CommentController");
const fetchUser = require("../middleware/AuthMiddleware");

const router = express.Router();

router.get("/comments", getComments); // GET /api/comments?productId=123
router.post("/comments", fetchUser, addComment); // POST /api/comments?productId=123

module.exports = router;
