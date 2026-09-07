import React, { useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

const ManageQuiz = () => {
    const { courseId, lessonId } = useParams()

    const [question, setQuestion] = useState("")
    const [options, setOptions] = useState(["", "", "", ""])
    const [correctAnswer, setCorrectAnswer] = useState("")

    const handleOptionChange = (index, value) => {
        const updated = [...options]
        updated[index] = value
        setOptions(updated)
    }

    const addQuiz = (e) => {
        e.preventDefault()

        const data = {
            courseId,
            lessonId,
            question,
            options,
            correctAnswer
        }

        axios.post(`${import.meta.env.VITE_API_URL}/quiz/add`, data)
            .then(() => {
                alert("Question added successfully")
                setQuestion("")
                setOptions(["", "", "", ""])
                setCorrectAnswer("")
            })
            .catch((err) => console.log(err))
    }

    return (
        <div
            className="container-fluid py-5"
            style={{ backgroundColor: "#f6e7c1", minHeight: "100vh" }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h3 className="mb-4 pt-3">Add Challenge Question</h3>

                        <div
                            className="p-4 rounded"
                            style={{
                                backgroundColor: "#fffaf0",
                                border: "1px solid #c99a24"
                            }}
                        >
                            <form onSubmit={addQuiz}>
                                <div className="mb-3">
                                    <label className="form-label">Question</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        required
                                    />
                                </div>

                                {options.map((option, index) => (
                                    <div className="mb-3" key={index}>
                                        <label className="form-label">
                                            Option {String.fromCharCode(65 + index)}
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}

                                <div className="mb-3">
                                    <label className="form-label">Correct Answer</label>

                                    <select
                                        className="form-select"
                                        value={correctAnswer}
                                        onChange={(e) => setCorrectAnswer(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Correct Answer</option>

                                        {options.map((option, index) => (
                                            <option value={option} key={index}>
                                                Option {String.fromCharCode(65 + index)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn"
                                    style={{ backgroundColor: "#c99a24", color: "white" }}
                                >
                                    Add Question
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageQuiz
