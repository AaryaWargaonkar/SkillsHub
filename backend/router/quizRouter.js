const express = require("express")
const { addQuiz, getLessonQuiz, deleteQuiz } = require("../controller/quizController")

const quizRouter = express.Router()

quizRouter.post("/add", addQuiz)
quizRouter.get("/lesson/:lessonId", getLessonQuiz)
quizRouter.delete("/delete/:id", deleteQuiz)

module.exports = quizRouter