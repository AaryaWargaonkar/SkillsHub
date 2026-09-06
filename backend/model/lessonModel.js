const mongoose = require("mongoose")

const lessonSchema = mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "test",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    }
})
const lessonModel = mongoose.model("lesson", lessonSchema)

module.exports = lessonModel