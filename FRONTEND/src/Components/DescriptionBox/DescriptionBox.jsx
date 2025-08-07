

import React, { useState, useEffect } from "react";
import "./DescriptionBox.css";

function DescriptionBox(props) {
  const { product } = props;
  const [showReviewPage, setShowReviewPage] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product?._id) {
      fetchComments();
    }
  }, [product]); // Fetch comments when product changes (fixes refresh issue)

  const fetchComments = () => {
    if (!product?._id) return;
    setLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments?productId=${product._id}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setLoading(false);
      });
  };

  const handleClick = () => setShowReviewPage(true);

  const handleCommentChange = (e) => setNewComment(e.target.value);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments?productId=${product._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": `${localStorage.getItem("auth-token")}`,
      },
      body: JSON.stringify({ commentText: newComment }),
    })
      .then((response) => response.json())
      .then(() => {
        setNewComment("");  // Clear input field
        fetchComments();    // Fetch updated comments after submission
      })
      .catch((err) => console.error("Error submitting comment:", err));
  };

  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div
          className="descriptionbox-nav-box"
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          Reviews
        </div>
      </div>

      <div className="descriptionbox-description">
        <p>
          An e-commerce website is an online Platform that facilitates buying
          and selling of products or services over the internet. It serves as a
          virtual marketplace where businesses and individuals showcase their
          products, interact with customers, and conduct transactions.
        </p>
      </div>

      {showReviewPage && (
        <div className="reviews-page">
          <h2>Reviews ({comments.length})</h2>
          {loading ? (
            <div className="loading-spinner-overlay">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <p>
                    <span style={{ color: "blue", display: "flex" }}>
                      {comment.userName}
                    </span>
                    {comment.comment}
                  </p>
                  <br />
                </div>
              ))}
            </div>
          )}
          <div className="comment-form">
            <textarea
              placeholder="Write a comment..."
              rows="5"
              value={newComment}
              onChange={handleCommentChange}
            ></textarea>
            <button onClick={handleCommentSubmit}>Submit Comment</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DescriptionBox;

