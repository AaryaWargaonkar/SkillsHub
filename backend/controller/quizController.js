const quizModel = require("../model/quizModel")

exports.addQuiz = async (req, resp) => {
    try {
        const quiz = new quizModel(req.body)
        const result = await quiz.save()
        resp.status(200).json(result)
    } catch (error) {
        console.log(error)
        resp.status(500).json({ message: "Failed to add question" })
    }
}

exports.getLessonQuiz = async (req, resp) => {
    try {
        const data = await quizModel.find({ lessonId: req.params.lessonId })
        resp.status(200).json(data)
    } catch (error) {
        console.log(error)
        resp.status(500).json({ message: "Failed to fetch questions" })
    }
}

exports.deleteQuiz = async (req, resp) => {
    try {
        const data = await quizModel.findByIdAndDelete(req.params.id)

        if (data) {
            resp.status(200).json({ message: "Question deleted" })
        } else {
            resp.status(404).json({ message: "Question not found" })
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json({ message: "Failed to delete question" })
    }
}