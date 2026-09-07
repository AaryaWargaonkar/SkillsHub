import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const InstructorMyCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const instructorId = localStorage.getItem("userId");

    axios
      .get(`${import.meta.env.VITE_API_URL}/my-courses/${instructorId}`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    const instructorId = localStorage.getItem("userId");

    if (window.confirm("Are you sure you want to delete this course?")) {
      axios
        .delete(
         `${import.meta.env.VITE_API_URL}/delete/${id}?instructorId=${instructorId}`,
        )
        .then((res) => {
          alert(res.data.message);
          setCourses(courses.filter((course) => course._id !== id));
        })
        .catch((err) => {
          console.log(err);
          alert(err.response?.data?.message || "Failed to delete course");
        });
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{ backgroundColor: "#f6e7c1", minHeight: "100vh" }}
    >
      <div className="container">
        <h2 className="mb-4 pt-3">My Courses</h2>

        <div className="row">
          {courses.length === 0 ? (
            <h5>You have not created any courses yet.</h5>
          ) : (
            courses.map((course) => (
              <div className="col-md-4 mb-4" key={course._id}>
                <div
                  className="card h-100 border-0 shadow-sm"
                  style={{ backgroundColor: "#fffaf0" }}
                >
                  <img
                    className="card-img-top"
                    src={course.image}
                    alt={course.courseName}
                    style={{ height: "250px", objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h4 className="card-title">{course.courseName}</h4>

                    <p className="card-text">Category: {course.category}</p>

                    <p className="card-text">
                      Duration: {course.duration} months
                    </p>

                    <p className="card-text">Level: {course.level}</p>

                    <p className="card-text">
                      Students Enrolled: {course.studentCount}
                    </p>

                    <p className="card-text">
                      ⭐ {course.averageRating} / 5
                    </p>

                    <p className="card-text">
                      {course.totalReviews} Review(s)
                    </p>

                    <NavLink
                      className="btn me-2"
                      style={{ backgroundColor: "#c99a24", color: "#fff" }}
                      to={`/show/${course._id}`}
                    >
                      View
                    </NavLink>

                    <NavLink
                      className="btn btn-primary me-2"
                      to={`/add-lesson/${course._id}`}
                    >
                      Manage Lessons
                    </NavLink>

                    <NavLink
                      className="btn btn-info"
                      to={`/instructor-reviews/${course._id}`}
                    >
                      Reviews
                    </NavLink>

                    <NavLink
                      className="btn btn-warning me-2 my-2"
                      to={`/edit/${course._id}`}
                      style={{ width: "146px" }}
                    >
                      Edit
                    </NavLink>

                    <button
                      className="btn btn-danger me-2 my-2"
                      onClick={() => handleDelete(course._id)}
                      style={{ width: "146px" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorMyCourses;
