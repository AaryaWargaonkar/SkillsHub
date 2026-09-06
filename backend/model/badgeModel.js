const mongoose = require("mongoose")

const badgeSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skillhub",
        required: true
    },
    badgeName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    earnedAt: {
        type: Date,
        default: Date.now
    }
})

const badgeModel = mongoose.model("badge", badgeSchema)

module.exports = badgeModel