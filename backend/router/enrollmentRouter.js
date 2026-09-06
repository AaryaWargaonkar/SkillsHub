const express = require("express")
const { enrollCourse, getMyCourses, completeLesson } = require("../controller/enrollmentController")

const enrollmentRouter = express.Router()

enrollmentRouter.post("/enroll", enrollCourse)
enrollmentRouter.get("/my-courses/:studentId", getMyCourses)
enrollmentRouter.put("/complete-lesson", completeLesson)

module.exports = enrollmentRouter