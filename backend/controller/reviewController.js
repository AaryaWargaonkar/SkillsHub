const reviewModel = require("../model/reviewModel")
const enrollmentModel = require("../model/enrollmentModel")
const { itemModel } = require("../model/model")

exports.addReview = async (req, resp) => {
    try {
        const { studentId, courseId, rating, comment } = req.body

        const enrollment = await enrollmentModel.findOne({
            studentId,
            courseId
        })

        if (!enrollment) {
            return resp.status(403).json({
                message: "You must enroll in this course before reviewing it"
            })
        }

        const existingReview = await reviewModel.findOne({
            studentId,
            courseId
        })

        if (existingReview) {
            return resp.status(400).json({
                message: "You have already reviewed this course"
            })
        }

        const review = await reviewModel.create({
            studentId,
            courseId,
            rating,
            comment
        })

        resp.status(201).json({
            message: "Review added successfully",
            review
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            message: "Failed to add review"
        })
    }
}

exports.getCourseReviews = async (req, resp) => {
    try {
        const { courseId } = req.params

        const reviews = await reviewModel
            .find({ courseId })
            .populate("studentId", "uname")

        const totalReviews = reviews.length

        const averageRating = totalReviews === 0
            ? 0
            : (
                reviews.reduce((sum, review) => sum + review.rating, 0) /
                totalReviews
            ).toFixed(1)

        resp.status(200).json({
            averageRating: Number(averageRating),
            totalReviews,
            reviews
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            message: "Failed to fetch reviews"
        })
    }
}

exports.updateReview = async (req, resp) => {
    try {
        const { studentId, rating, comment } = req.body

        const review = await reviewModel.findOneAndUpdate(
            {
                _id: req.params.id,
                studentId
            },
            {
                rating,
                comment
            },
            { new: true }
        )

        if (!review) {
            return resp.status(403).json({
                message: "You can only update your own review"
            })
        }

        resp.status(200).json({
            message: "Review updated successfully",
            review
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            message: "Failed to update review"
        })
    }
}

exports.deleteReview = async (req, resp) => {
    try {
        const { studentId } = req.body

        const review = await reviewModel.findOneAndDelete({
            _id: req.params.id,
            studentId
        })

        if (!review) {
            return resp.status(403).json({
                message: "You can only delete your own review"
            })
        }

        resp.status(200).json({
            message: "Review deleted successfully"
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            message: "Failed to delete review"
        })
    }
}

exports.replyToReview = async (req, resp) => {
    try {
        const { instructorId, reply } = req.body

        const review = await reviewModel.findById(req.params.id)

        if (!review) {
            return resp.status(404).json({
                message: "Review not found"
            })
        }

        const course = await itemModel.findOne({
            _id: review.courseId,
            instructorId
        })

        if (!course) {
            return resp.status(403).json({
                message: "You can only reply to reviews on your own courses"
            })
        }

        review.reply = reply

        await review.save()

        resp.status(200).json({
            message: "Reply added successfully",
            review
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            message: "Failed to reply to review"
        })
    }
}