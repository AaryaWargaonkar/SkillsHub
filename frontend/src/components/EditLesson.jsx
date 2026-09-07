import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const EditLesson = () => {
  const [lesson, setLesson] = useState({
    title: "",
    description: "",
    videoUrl: "",
    order: ""
  })

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/lesson/show/${id}`)
      .then((res) => {
        setLesson({
          title: res.data.title,
          description: res.data.description,
          videoUrl: res.data.videoUrl || "",
          order: res.data.order
        })
      })
      .catch((err) => {
        console.log(err)
        alert(err.response?.data?.message || "Failed to fetch lesson")
      })
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()

    axios
      .put(`${import.meta.env.VITE_API_URL}/lesson/update/${id}`, lesson)
      .then((res) => {
        alert(res.data.message)
        navigate(-1)
      })
      .catch((err) => {
        console.log(err)
        alert(err.response?.data?.message || "Failed to update lesson")
      })
  }

  return (
    <>
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#f6e7c1", minHeight: "100vh" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <h2 className="mb-4 pt-3">Edit Lesson</h2>

              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: "#fffaf0",
                  border: "1px solid #c99a24"
                }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Lesson Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={lesson.title}
                      onChange={(e) =>
                        setLesson({ ...lesson, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={lesson.description}
                      onChange={(e) =>
                        setLesson({ ...lesson, description: e.target.value })
                      }
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Video URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={lesson.videoUrl}
                      onChange={(e) =>
                        setLesson({ ...lesson, videoUrl: e.target.value })
                      }
                      placeholder="https://www.youtube.com/embed/..."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      className="form-control"
                      value={lesson.order}
                      onChange={(e) =>
                        setLesson({ ...lesson, order: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn me-2"
                    style={{
                      backgroundColor: "#c99a24",
                      color: "white",
                      border: "none"
                    }}
                  >
                    Update Lesson
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditLesson
