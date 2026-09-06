import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams, NavLink } from "react-router-dom"

const AddLesson = () => {
  const [lesson, setLesson] = useState({
    title: "",
    description: "",
    videoUrl: "",
    order: ""
  })

  const [lessons, setLessons] = useState([])

  const { id } = useParams()
  const navigate = useNavigate()

  const fetchLessons = () => {
    axios
      .get(`http://localhost:4000/lesson/course/${id}`)
      .then((res) => setLessons(res.data))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchLessons()
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()

    axios
      .post("http://localhost:4000/lesson/add", {
        courseId: id,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        order: lesson.order
      })
      .then((res) => {
        alert(res.data.message)

        setLesson({
          title: "",
          description: "",
          videoUrl: "",
          order: ""
        })

        fetchLessons()
      })
      .catch((err) => {
        console.log(err)
        alert(err.response?.data?.message || "Failed to add lesson")
      })
  }

  const handleDelete = (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      axios
        .delete(`http://localhost:4000/lesson/delete/${lessonId}`)
        .then((res) => {
          alert(res.data.message)
          fetchLessons()
        })
        .catch((err) => {
          console.log(err)
          alert(err.response?.data?.message || "Failed to delete lesson")
        })
    }
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
              <h2 className="mb-4 pt-3">Add Lesson</h2>

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
                    className="btn"
                    style={{
                      backgroundColor: "#c99a24",
                      color: "white",
                      border: "none"
                    }}
                  >
                    Add Lesson
                  </button>
                </form>
              </div>
            </div>
          </div>

          <hr className="my-5" />

          <h2 className="mb-4">Course Lessons</h2>

          {lessons.length === 0 ? (
            <p>No lessons added yet.</p>
          ) : (
            lessons.map((item) => (
              <div
                className="card mb-3"
                key={item._id}
                style={{
                  backgroundColor: "#fffaf0",
                  border: "1px solid #c99a24"
                }}
              >
                <div className="card-body">
                  <h4>
                    {item.order}. {item.title}
                  </h4>

                  <p>{item.description}</p>

                  {item.videoUrl && (
                    <p>
                      <strong>Video:</strong> {item.videoUrl}
                    </p>
                  )}

                  <NavLink
                    to={`/edit-lesson/${item._id}`}
                    className="btn btn-warning me-2"
                  >
                    Edit
                  </NavLink>

                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>

                  <NavLink
                    to={`/manage-quiz/${id}/${item._id}`}
                    className="btn btn-info"
                  >
                    📝 Manage Challenge
                  </NavLink>
                </div>
              </div>
            ))
          )}

          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate(`/show/${id}`)}
          >
            Back to Course
          </button>
        </div>
      </div>
    </>
  )
}

export default AddLesson