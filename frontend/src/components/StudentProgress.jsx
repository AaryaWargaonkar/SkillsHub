import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";

const StudentProgress = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const studentId = localStorage.getItem("userId");

    if (!studentId) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/enrollment/my-courses/${studentId}`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  const completedCourses = courses.filter(
    (course) => course.progress === 100,
  ).length;

  const inProgressCourses = courses.filter(
    (course) => course.progress > 0 && course.progress < 100,
  ).length;

  return (
    <>
      <StudentNavbar />

      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#e0ebfc", minHeight: "100vh" }}
      >
        <div className="container">
          <div className="mb-4">
            <h2 className="mb-1 pt-3">My Learning Progress</h2>
            <p className="text-muted mb-0">
              Track your learning journey and course completion.
            </p>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body py-2">
                  <p className="text-muted mb-1">Enrolled Courses</p>
                  <h3 className="mb-0">{courses.length}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body py-2">
                  <p className="text-muted mb-1">In Progress</p>
                  <h3 className="mb-0">{inProgressCourses}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body py-2">
                  <p className="text-muted mb-1">Completed</p>
                  <h3 className="mb-0">{completedCourses}</h3>
                </div>
              </div>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-4">
                <h5 className="text-muted mb-1">
                  You have not enrolled in any courses yet.
                </h5>
                <p className="text-muted mb-0">
                  Enroll in a course to start tracking your progress.
                </p>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {courses.map((course) => (
                <div className="col-md-6" key={course.enrollmentId}>
                  <div className="card h-100 border-0 shadow-sm overflow-hidden">
                    <img
                      src={course.image}
                      className="card-img-top"
                      alt={course.courseName}
                      style={{ height: "240px", objectFit: "cover" }}
                    />

                    <div className="card-body px-3 py-2">
                      <h5 className="mb-2">{course.courseName}</h5>

                      <p className="mb-1 small">
                        <strong>Instructor:</strong> {course.instructor}
                      </p>

                      <p className="mb-2 small">
                        <strong>Lessons:</strong> {course.completedLessonCount}{" "}
                        / {course.totalLessons}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mb-1 small">
                        <span className="text-muted">Course Progress</span>
                        <strong>{course.progress}%</strong>
                      </div>

                      <div className="progress mb-2" style={{ height: "8px" }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>

                      {course.progress === 100 ? (
                        <div className="alert alert-success py-1 px-2 mb-2 small">
                          🎉 Course Completed!
                        </div>
                      ) : course.progress > 0 ? (
                        <p className="text-primary small mb-2">
                          Keep learning! You're making progress.
                        </p>
                      ) : (
                        <p className="text-secondary small mb-2">
                          Start learning this course.
                        </p>
                      )}

                      <div className="d-flex gap-2 w-100">
                        <NavLink
                          className="btn btn-primary flex-fill"
                          to={`/learn/${course.courseId}`}
                        >
                          {course.progress === 100
                            ? "▶ Rewatch"
                            : "Continue Learning"}
                        </NavLink>

                        {course.progress === 100 && (
                          <>
                            <NavLink
                              className="btn btn-success ms-2"
                              style={{ minWidth: "180px" }}
                              to={`/certificate/${course.courseId}`}
                            >
                              Get Certificate
                            </NavLink>

                            <NavLink
                              className="btn btn-warning ms-2"
                              style={{ minWidth: "180px" }}
                              to={`/student-course/${course.courseId}`}
                            >
                              Review Course
                            </NavLink>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentProgress;
