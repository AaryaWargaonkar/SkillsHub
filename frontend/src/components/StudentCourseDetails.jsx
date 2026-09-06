import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import StudentNavbar from './StudentNavbar'

const StudentCourseDetails = () => {
  const [item, setItem] = useState({})
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [averageRating, setAverageRating] = useState(0)
  const [editingReview, setEditingReview] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()
  const studentId = localStorage.getItem("userId")

  const fetchReviews = () => {
    axios.get(`http://localhost:4000/review/course/${id}`)
      .then((res) => {
        setReviews(res.data.reviews)
        setAverageRating(res.data.averageRating)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    axios.get(`http://localhost:4000/show/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.log(err))

    fetchReviews()

    if (studentId) {
      axios.get(`http://localhost:4000/enrollment/my-courses/${studentId}`)
        .then((res) => {
          const enrolled = res.data.some(
            (course) => String(course.courseId) === String(id)
          )
          setIsEnrolled(enrolled)
        })
        .catch((err) => console.log(err))
    }
  }, [id])

  const enrollFreeCourse = () => {
    axios.post("http://localhost:4000/enrollment/enroll", {
      studentId: studentId,
      courseId: id
    })
      .then((res) => {
        alert(res.data.message)
        setIsEnrolled(true)
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Enrollment failed")
      })
  }

  const handlePayment = () => {
    setPaymentLoading(true)

    axios.post("http://localhost:4000/payment/create-order", {
      studentId: studentId,
      courseId: id
    })
      .then((res) => {
        const { orderId, amount, currency, keyId } = res.data

        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "SkillsHub",
          description: item.courseName,
          order_id: orderId,
          handler: function (response) {
            axios.post("http://localhost:4000/payment/verify", {
              studentId: studentId,
              courseId: id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
              .then((res) => {
                alert(res.data.message)
                setIsEnrolled(true)
                setPaymentLoading(false)
              })
              .catch((err) => {
                console.log(err)
                alert(err.response?.data?.message || "Payment verification failed")
                setPaymentLoading(false)
              })
          },
          prefill: {
            name: localStorage.getItem("uname") || "",
            email: localStorage.getItem("email") || ""
          },
          theme: {
            color: "#0d6efd"
          },
          modal: {
            ondismiss: function () {
              setPaymentLoading(false)
            }
          }
        }

        const razorpay = new window.Razorpay(options)

        razorpay.on("payment.failed", function () {
          alert("Payment failed. Please try again.")
          setPaymentLoading(false)
        })

        razorpay.open()
      })
      .catch((err) => {
        console.log(err)
        alert(err.response?.data?.message || "Failed to create payment order")
        setPaymentLoading(false)
      })
  }

  const handleEnroll = () => {
    if (!studentId) {
      alert("Please login first")
      navigate("/login")
      return
    }

    if (Number(item.price) > 0) {
      handlePayment()
    } else {
      enrollFreeCourse()
    }
  }

  const handleReview = (e) => {
    e.preventDefault()

    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    if (!comment.trim()) {
      alert("Please enter a comment")
      return
    }

    if (editingReview) {
      axios.put(`http://localhost:4000/review/update/${editingReview}`, {
        studentId: studentId,
        rating: rating,
        comment: comment
      })
        .then((res) => {
          alert(res.data.message)
          setRating(0)
          setComment('')
          setEditingReview(null)
          fetchReviews()
        })
        .catch((err) => {
          alert(err.response?.data?.message || "Failed to update review")
        })
    } else {
      axios.post("http://localhost:4000/review/add", {
        studentId: studentId,
        courseId: id,
        rating: rating,
        comment: comment
      })
        .then((res) => {
          alert(res.data.message)
          setRating(0)
          setComment('')
          fetchReviews()
        })
        .catch((err) => {
          alert(err.response?.data?.message || "Failed to submit review")
        })
    }
  }

  const handleEdit = (review) => {
    setEditingReview(review._id)
    setRating(review.rating)
    setComment(review.comment)
    window.scrollTo({ top: 400, behavior: "smooth" })
  }

  const handleDelete = (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) {
      return
    }

    axios.delete(`http://localhost:4000/review/delete/${reviewId}`, {
      data: {
        studentId: studentId
      }
    })
      .then((res) => {
        alert(res.data.message)
        fetchReviews()
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to delete review")
      })
  }

  const cancelEdit = () => {
    setEditingReview(null)
    setRating(0)
    setComment('')
  }

  return (
    <>
      <StudentNavbar />

      <div
        className="container-fluid  "
        style={{ backgroundColor: "#e0ebfc",paddingTop: "90px"  }}
      >
        <div className="container ">

          <div className="card mb-5 border-0 shadow-sm overflow-hidden ">
            <div className="row g-0">

              <div className="col-md-5 ">
                <img
                  src={item.image}
                  className="img-fluid w-100"
                  alt={item.courseName}
                  style={{ height: "100%", minHeight: "350px", objectFit: "cover" }}
                />
              </div>

              <div className="col-md-7">
                <div className="card-body p-4">

                  <h2 className="mb-4">{item.courseName}</h2>

                  <p><strong>Instructor:</strong> {item.instructor}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Duration:</strong> {item.duration} months</p>
                  <p><strong>Level:</strong> {item.level}</p>

                  <p>
                    <strong>Price:</strong>{" "}
                    <span className={Number(item.price) > 0 ? "text-primary fw-bold" : "text-success fw-bold"}>
                      {Number(item.price) > 0 ? `₹${item.price}` : "Free"}
                    </span>
                  </p>

                  <p className="mb-4">
                    <strong>Rating:</strong> ⭐ {averageRating} / 5
                  </p>

                  <button
                    className={isEnrolled ? "btn btn-success" : "btn btn-primary"}
                    onClick={handleEnroll}
                    disabled={isEnrolled || paymentLoading}
                  >
                    {isEnrolled
                      ? "✓ Enrolled"
                      : paymentLoading
                      ? "Processing..."
                      : Number(item.price) > 0
                      ? `Pay ₹${item.price} & Enroll`
                      : "Enroll Now"}
                  </button>

                </div>
              </div>

            </div>
          </div>

          <div className="card mb-5 border-0 shadow-sm">
            <div className="card-body p-4">

              <h3 className="mb-3">
                {editingReview ? "Edit Your Review" : "Rate this Course"}
              </h3>

              <div className="mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="btn btn-link fs-3 text-decoration-none"
                    onClick={() => setRating(star)}
                  >
                    {star <= rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleReview}>

                <div className="mb-3">
                  <label className="form-label">
                    Comment
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-success me-2"
                >
                  {editingReview ? "Update Review" : "Submit Review"}
                </button>

                {editingReview && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}

              </form>

            </div>
          </div>

          <div>
            <h3 className="mb-4">
              Student Reviews
            </h3>

            {reviews.length === 0 ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-muted mb-0">No reviews yet.</p>
                </div>
              </div>
            ) : (
              reviews.map((review) => {

                const isMyReview =
                  String(review.studentId?._id) === String(studentId)

                return (
                  <div className="card mb-3 border-0 shadow-sm" key={review._id}>
                    <div className="card-body">

                      <h5>
                        {review.studentId?.uname || "Student"}
                      </h5>

                      <p className="mb-2">
                        {"⭐".repeat(review.rating)}
                      </p>

                      <p>{review.comment}</p>

                      {isMyReview && (
                        <div className="mt-3">
                          <button
                            className="btn btn-warning me-2"
                            onClick={() => handleEdit(review)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(review._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      {review.reply && (
                        <div className="alert alert-secondary mt-3 mb-0">
                          <strong>Instructor Reply:</strong>
                          <p className="mb-0">
                            {review.reply}
                          </p>
                        </div>
                      )}

                    </div>
                  </div>
                )
              })
            )}

          </div>

        </div>
      </div>
    </>
  )
}

export default StudentCourseDetails