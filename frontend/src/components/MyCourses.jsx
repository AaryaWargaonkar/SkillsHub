import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const studentId = localStorage.getItem("userId");

    if (!studentId) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/enrollment/my-courses/${studentId}`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <StudentNavbar />

      <div
        className="container-fluid py-4"
        style={{ backgroundColor: "#e0ebfc", minHeight: "100vh" ,paddingTop:"200px" }}
      >
        <div className="container " 
                style={{ paddingTop:"50px" }}
>
          <h2 className="mb-1 ">My Courses</h2>
          <p className="text-muted mb-4">
            Continue learning and track your progress.
          </p>

          <div className="row g-4">
            {courses.length === 0 ? (
              <div className="text-center py-5">
                <h5 className="text-muted">
                  You have not enrolled in any courses yet.
                </h5>
              </div>
            ) : (
              courses.map((course) => (
                <div className="col-md-4" key={course.enrollmentId}>
                  <div className="card h-100 border-0 shadow-sm overflow-hidden">
                    <img
                      src={course.image}
                      className="card-img-top"
                      alt={course.courseName}
                      style={{ height: "220px", objectFit: "cover" }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h4 className="card-title mb-3">{course.courseName}</h4>

                      <p className="card-text mb-2">
                        <strong>Instructor:</strong> {course.instructor}
                      </p>

                      <p className="card-text mb-2">
                        <strong>Category:</strong> {course.category}
                      </p>

                      <p className="card-text mb-2">
                        <strong>Duration:</strong> {course.duration} months
                      </p>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted">Progress</span>
                        <strong>{course.progress}%</strong>
                      </div>

                      <div className="progress mb-4" style={{ height: "8px" }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>

                      <div className="mt-auto">
                        {course.progress === 100 ? (
                          <div className="d-flex flex-wrap gap-2">
                            <div className="d-flex gap-2">
                              <div className="d-flex gap-2">
                                <NavLink
                                  className="btn btn-primary px-4"
                                  to={`/learn/${course.courseId}`}
                                >
                                  ▶ Rewatch
                                </NavLink>

                                
                              </div>
                            </div>
                          </div>
                        ) : (
                          <NavLink
                            className="btn btn-primary"
                            to={`/learn/${course.courseId}`}
                          >
                            Continue Learning
                          </NavLink>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCourses;
