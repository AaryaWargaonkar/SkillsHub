const express = require("express")

const {
    addReview,
    getCourseReviews,
    updateReview,
    deleteReview,
    replyToReview
} = require("../controller/reviewController")

const reviewRouter = express.Router()

reviewRouter.post("/add", addReview)
reviewRouter.get("/course/:courseId", getCourseReviews)
reviewRouter.put("/update/:id", updateReview)
reviewRouter.delete("/delete/:id", deleteReview)
reviewRouter.put("/reply/:id", replyToReview)

module.exports = reviewRouter