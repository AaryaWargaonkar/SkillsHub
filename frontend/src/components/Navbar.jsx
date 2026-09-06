import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"

const Navbar = () => {
  const navigate = useNavigate()
  const uname = localStorage.getItem("uname")

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container ">
          <NavLink className="navbar-brand" to="#">SkillsHub</NavLink>

          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavId"
            aria-controls="collapsibleNavId"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="collapsibleNavId">
            <ul className="navbar-nav me-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/home">Home</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/add">Add Course</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/my-instructor-courses">My Courses</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">Profile</NavLink>
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
  )
}

export default Navbar