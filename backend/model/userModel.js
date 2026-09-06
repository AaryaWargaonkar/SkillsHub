const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    uname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student"
    }

}, { timestamps: true });

const userModel = mongoose.model("skillhub", userSchema);

module.exports = userModel;