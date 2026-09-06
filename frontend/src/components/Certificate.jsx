import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StudentNavbar from "./StudentNavbar";
import "./Certificate.css";

const Certificate = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({});

  const studentName = localStorage.getItem("uname");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/show/${id}`)
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const downloadCertificate = () => {
    window.print();
  };

  return (
    <>
      {/* Navbar */}
      <div className="certificate-navbar">
        <StudentNavbar />
      </div>

      {/* Certificate Page */}
      <div className="certificate-page" style={{ paddingTop: "90px" }}>
        <div className="certificate ">
          <div className="certificate-content">
            {/* Title */}
            <div className="certificate-title">CERTIFICATE</div>

            <div className="certificate-subtitle">OF COMPLETION</div>

            <div className="certificate-line"></div>

            {/* Student */}
            <p className="presented-text">
              This certificate is proudly presented to
            </p>

            <h2 className="student-name">{studentName}</h2>

            {/* Course */}
            <p className="completion-text">
              in recognition of successfully completing the course
            </p>

            <h2 className="course-name">{course.courseName}</h2>

            <p className="achievement-text">
              demonstrating dedication and commitment to learning.
            </p>

            {/* Details */}
            <div className="certificate-details">
              <div>
                <span>Instructor</span>
                <strong>{course.instructor}</strong>
              </div>

              <div>
                <span>Date of Completion</span>
                <strong>{new Date().toLocaleDateString()}</strong>
              </div>
            </div>

            {/* Platform */}
            <div className="platform-name">
              <strong>SkillsHub</strong>
              <span>Learning & Development Platform</span>
            </div>

            {/* Download */}
            <button
              className="btn btn-success mt-4 no-print"
              onClick={downloadCertificate}
            >
              Download Certificate
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
