// import React, { useState, useEffect } from "react";
// import "./DescriptionBox.css";

// function DescriptionBox(props) {
//   const { product } = props;
//   const [showReviewPage, setShowReviewPage] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (showReviewPage) {
//       fetchComments();
//     }
//   }, [showReviewPage]); // Fetch comments only when review page opens

//   const fetchComments = () => {
//     if (!product?._id) return;
//     setLoading(true);

//     fetch(`http://localhost:4000/comments?productId=${product._id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setComments(data.comments || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching comments:", err);
//         setLoading(false);
//       });

//     // if backend send the data is structure format then
//     // // to retrieve that data we have use that variable
//     // // like data.commenList.comments
//     // // res.status(200).json({commentList});
//     // // it will give a key name to  object
//     // // console.log(data.comments); // console.log("-------------");
//   };

//   const handleClick = () => setShowReviewPage(true);

//   const handleCommentChange = (e) => setNewComment(e.target.value);

//   const handleCommentSubmit = () => {
//     if (!newComment.trim()) return;

//     const newCommentData = { comment: newComment }; // Simulate backend response

//     fetch(`http://localhost:4000/comments?productId=${product._id}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "auth-token": `${localStorage.getItem("auth-token")}`,
//       },
//       body: JSON.stringify({ commentText: newComment }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setComments((prev) => [...prev, newCommentData]); // Update state instantly without fetching from backend
//         setNewComment(""); // Clear input field
//       })
//       .catch((err) => console.error("Error submitting comment:", err));

//     // same for this as well   body: JSON.stringify({ commentText: newComment }),
//     //  // in backend we have to use in structure format like {commentTex} = req.body;
//   };

//   return (
//     <div className="descriptionbox">
//       <div className="descriptionbox-navigator">
//         <div className="descriptionbox-nav-box">Description</div>
//         <div
//           className="descriptionbox-nav-box"
//           onClick={handleClick}
//           style={{ cursor: "pointer" }}
//         >
//           Reviews
//         </div>
//       </div>

//       <div className="descriptionbox-description">
//         <p>
//           An e-commerce website is an online Platform that facilitates buying
//           and selling of products or services over the internet. It serves as a
//           virtual marketplace where businesses and individuals showcase their
//           products, interact with customers, and conduct transactions.
//         </p>
//       </div>

//       {showReviewPage && (
//         <div className="reviews-page">
//           <h2>Reviews ({comments.length})</h2>
//           {loading ? (
//             <div className="loading-spinner-overlay">
//               <div className="loading-spinner"></div>
//             </div>
//           ) : (
//             <div className="comments-list">
//               {comments.map((comment, index) => (
//                 <div key={index} className="comment-item">
//                   <p>
//                     {" "}
//                     <span style={{ color: "blue", display: "flex" }}>
//                       {comment.userName}
//                     </span>
//                     {comment.comment}
//                   </p>
//                   <br />
//                 </div>
//               ))}
//             </div>
//           )}
//           <div className="comment-form">
//             <textarea
//               placeholder="Write a comment..."
//               rows="5"
//               value={newComment}
//               onChange={handleCommentChange}
//             ></textarea>
//             <button onClick={handleCommentSubmit}>Submit Comment</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DescriptionBox;

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

    fetch(`http://localhost:4000/comments?productId=${product._id}`)
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

    fetch(`http://localhost:4000/comments?productId=${product._id}`, {
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

