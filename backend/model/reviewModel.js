const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skillhub",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "test",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    reply: {
        type: String,
        default: ""
    }
}, { timestamps: true })

const reviewModel = mongoose.model("review", reviewSchema)

module.exports = reviewModel