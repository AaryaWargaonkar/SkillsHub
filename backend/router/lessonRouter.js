const express = require("express")
const { addLesson, getLessons, getLessonById, updateLesson, deleteLesson } = require("../controller/lessonController")

const lessonRouter = express.Router()

lessonRouter.post("/add", addLesson)
lessonRouter.get("/course/:courseId", getLessons)
lessonRouter.get("/show/:id", getLessonById)
lessonRouter.put("/update/:id", updateLesson)
lessonRouter.delete("/delete/:id", deleteLesson)

module.exports = lessonRouter