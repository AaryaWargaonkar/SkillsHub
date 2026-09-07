import React from "react"
import { useState } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import axios from "axios"

const Register = () => {
  const [user,setUser]=useState({role:"student"})
  const navigate=useNavigate()

  const handleSubmit=(e)=>{
    e.preventDefault()

    axios.post(`${import.meta.env.VITE_API_URL}/user/register`,user)
    .then(()=>navigate("/login"))
    .catch((err)=>{
      console.log(err)
      alert(err.response?.data?.message || "Registration failed")
    })
  }

  return (
    <>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Create Account</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="uname"
                      placeholder="Username"
                      value={user.uname || ""}
                      onChange={(e)=>setUser({...user,uname:e.target.value})}
                      required
                    />
                    <label htmlFor="uname">Username</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={user.email || ""}
                      onChange={(e)=>setUser({...user,email:e.target.value})}
                      required
                    />
                    <label htmlFor="email">Email</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={user.password || ""}
                      onChange={(e)=>setUser({...user,password:e.target.value})}
                      required
                    />
                    <label htmlFor="password">Password</label>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Register As</label>

                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="role"
                        id="student"
                        value="student"
                        checked={user.role==="student"}
                        onChange={(e)=>setUser({...user,role:e.target.value})}
                      />
                      <label className="form-check-label" htmlFor="student">
                        Student
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="role"
                        id="instructor"
                        value="instructor"
                        checked={user.role==="instructor"}
                        onChange={(e)=>setUser({...user,role:e.target.value})}
                      />
                      <label className="form-check-label" htmlFor="instructor">
                        Instructor
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Register
                  </button>

                  <p className="text-center mb-0">
                    Already registered?{" "}
                    <NavLink to="/login">Login</NavLink>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
