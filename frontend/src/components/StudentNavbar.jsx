import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const uname = localStorage.getItem("uname");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
        <div className="container">
          <NavLink className="navbar-brand" to="/student">
            SkillsHub
          </NavLink>

          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#studentNavbar"
            aria-controls="studentNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="studentNavbar">
            <ul className="navbar-nav me-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/student">
                  Courses
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/my-courses">
                  My Courses
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/progress">
                  Progress
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/badges">
                   Badges
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  Profile
                </NavLink>
                </li>
              
            </ul>

            <span className="navbar-text text-white me-3">
              👤 {uname}
            </span>

            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default StudentNavbar;