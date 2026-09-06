import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const InstructorReviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [replies, setReplies] = useState({});

  const instructorId = localStorage.getItem("userId");

  const fetchReviews = () => {
    axios
      .get(`http://localhost:4000/review/course/${id}`)
      .then((res) => {
        setReviews(res.data.reviews);
        setAverageRating(res.data.averageRating);
        setTotalReviews(res.data.totalReviews);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleReply = (reviewId) => {
    const reply = replies[reviewId];

    if (!reply || !reply.trim()) {
      alert("Please enter a reply");
      return;
    }

    axios
      .put(`http://localhost:4000/review/reply/${reviewId}`, {
        instructorId: instructorId,
        reply: reply
      })
      .then((res) => {
        alert(res.data.message);
        setReplies({ ...replies, [reviewId]: "" });
        fetchReviews();
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to reply");
      });
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundColor: "#f6e7c1",
        minHeight: "100vh"
      }}
    >
      <div className="container">
        <div className="mb-4">
          <h2 className="mb-1 pt-3">Course Reviews</h2>
          <p className="text-muted mb-0">
            View student feedback and respond to their reviews.
          </p>
        </div>

        <div
          className="card mb-4 shadow-sm"
          style={{
            backgroundColor: "#fffaf0",
            border: "1px solid #c99a24",
            borderRadius: "10px"
          }}
        >
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-4 text-center">
                <h6 className="text-muted mb-2">Average Rating</h6>
                <h1 className="mb-1" style={{ color: "#c99a24" }}>
                  ⭐ {averageRating}
                </h1>
                <p className="mb-0 text-muted">out of 5</p>
              </div>

              <div className="col-md-4 text-center">
                <h6 className="text-muted mb-2">Total Reviews</h6>
                <h1 className="mb-1">{totalReviews}</h1>
                <p className="mb-0 text-muted">student review(s)</p>
              </div>

              <div className="col-md-4 text-center">
                <h6 className="text-muted mb-2">Course Feedback</h6>
                <h5 className="mb-1">
                  {totalReviews === 0
                    ? "No feedback yet"
                    : "Student feedback received"}
                </h5>
                <p className="mb-0 text-muted">
                  {totalReviews === 0
                    ? "Reviews will appear here"
                    : "Respond to your students"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div
            className="card shadow-sm"
            style={{
              backgroundColor: "#fffaf0",
              border: "1px solid #c99a24",
              borderRadius: "10px"
            }}
          >
            <div className="card-body text-center py-5">
              <div style={{ fontSize: "45px" }}>⭐</div>
              <h4 className="mt-3">No Reviews Yet</h4>
              <p className="text-muted mb-0">
                Students have not submitted any reviews for this course yet.
              </p>
            </div>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              className="card mb-3 shadow-sm"
              key={review._id}
              style={{
                backgroundColor: "#fffaf0",
                border: "1px solid #d8bd72",
                borderRadius: "10px"
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">
                      {review.studentId?.uname || "Student"}
                    </h5>
                    <small className="text-muted">Student Review</small>
                  </div>

                  <div
                    className="px-3 py-2 rounded"
                    style={{
                      backgroundColor: "#f6e7c1",
                      color: "#8a6810",
                      fontWeight: "600"
                    }}
                  >
                    ⭐ {review.rating} / 5
                  </div>
                </div>

                <div className="mb-3" style={{ fontSize: "20px" }}>
                  {"⭐".repeat(review.rating)}
                  <span className="text-muted">
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <div
                  className="p-3 rounded mb-3"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #ead9a7"
                  }}
                >
                  <strong>Student Comment</strong>
                  <p className="mb-0 mt-2">{review.comment}</p>
                </div>

                {review.reply && (
                  <div
                    className="p-3 rounded mb-3"
                    style={{
                      backgroundColor: "#f6e7c1",
                      borderLeft: "4px solid #c99a24"
                    }}
                  >
                    <strong>Your Reply</strong>
                    <p className="mb-0 mt-2">{review.reply}</p>
                  </div>
                )}

                <label className="form-label fw-semibold">
                  {review.reply ? "Update Your Reply" : "Reply to Student"}
                </label>

                <textarea
                  className="form-control mb-3"
                  rows="3"
                  placeholder={
                    review.reply
                      ? "Update your reply..."
                      : "Write a reply to this student..."
                  }
                  value={replies[review._id] || ""}
                  onChange={(e) =>
                    setReplies({
                      ...replies,
                      [review._id]: e.target.value
                    })
                  }
                ></textarea>

                <button
                  className="btn"
                  onClick={() => handleReply(review._id)}
                  style={{
                    backgroundColor: "#c99a24",
                    color: "white",
                    border: "none"
                  }}
                >
                  {review.reply ? "Update Reply" : "Reply"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstructorReviews;