const mongoose = require("mongoose")

const enrollmentSchema = mongoose.Schema({
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
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        type: Number,
        default: 0
    },
    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "lesson"
    }]
})

const enrollmentModel = mongoose.model("enrollment", enrollmentSchema)

module.exports = enrollmentModel