import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import StudentNavbar from "./StudentNavbar"

const StudentQuiz = () => {
    const { lessonId } = useParams()
    const navigate = useNavigate()
    const [quiz, setQuiz] = useState([])
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/quiz/lesson/${lessonId}`)
            .then((res) => setQuiz(res.data))
            .catch((err) => console.log(err))
    }, [lessonId])

    const handleAnswer = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer })
    }

    const handleSubmit = () => {
        let total = 0

        quiz.forEach((item) => {
            if (answers[item._id] === item.correctAnswer) {
                total++
            }
        })

        setScore(total)
        setSubmitted(true)
    }

    if (quiz.length === 0) {
        return (
            <>
                <StudentNavbar />

                <div
                    className="container-fluid py-5"
                    style={{ backgroundColor: "#e0ebfc", minHeight: "100vh" }}
                >
                    <div className="container">
                        <h3>No challenge available for this lesson.</h3>
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                            Back
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <StudentNavbar />

            <div
                className="container-fluid py-5"
                style={{ backgroundColor: "#e0ebfc", minHeight: "100vh" }}
            >
                <div className="container">
                    <h2 className="mb-4 pt-3">Lesson Challenge</h2>

                    {submitted && (
                        <div className="alert alert-info">
                            <h4>Challenge Result</h4>
                            <p className="mb-0">
                                You scored <strong>{score}</strong> out of <strong>{quiz.length}</strong>
                            </p>
                        </div>
                    )}

                    {quiz.map((item, index) => {
                        const userAnswer = answers[item._id]
                        const isCorrect = userAnswer === item.correctAnswer

                        return (
                            <div
                                className="card mb-4"
                                key={item._id}
                                style={{
                                    border: "1px solid #9bb7df",
                                    borderRadius: "8px"
                                }}
                            >
                                <div className="card-body">
                                    <h5>{index + 1}. {item.question}</h5>

                                    {item.options.map((option) => {
                                        const isUserAnswer = userAnswer === option
                                        const isCorrectAnswer = item.correctAnswer === option

                                        return (
                                            <div
                                                className={`form-check mt-2 ${
                                                    submitted && isCorrectAnswer
                                                        ? "text-success fw-bold"
                                                        : submitted && isUserAnswer && !isCorrectAnswer
                                                        ? "text-danger"
                                                        : ""
                                                }`}
                                                key={option}
                                            >
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name={item._id}
                                                    value={option}
                                                    checked={answers[item._id] === option}
                                                    onChange={() => handleAnswer(item._id, option)}
                                                    disabled={submitted}
                                                />

                                                <label className="form-check-label">
                                                    {option}

                                                    {submitted && isCorrectAnswer && (
                                                        <span className="ms-2">
                                                            ✅ Correct Answer
                                                        </span>
                                                    )}

                                                    {submitted && isUserAnswer && !isCorrectAnswer && (
                                                        <span className="ms-2">
                                                            ❌ Your Answer
                                                        </span>
                                                    )}
                                                </label>
                                            </div>
                                        )
                                    })}

                                    {submitted && (
                                        <div className={`mt-3 ${isCorrect ? "text-success" : "text-danger"}`}>
                                            {isCorrect ? (
                                                <strong>✅ Correct!</strong>
                                            ) : (
                                                <div>
                                                    <strong>❌ Wrong!</strong>
                                                    <p className="mb-0">
                                                        Your answer: {userAnswer || "Not answered"}
                                                    </p>
                                                    <p className="mb-0">
                                                        Correct answer: <strong>{item.correctAnswer}</strong>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {!submitted && (
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Submit Challenge
                        </button>
                    )}

                    {submitted && (
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                            Back to Lesson
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default StudentQuiz
