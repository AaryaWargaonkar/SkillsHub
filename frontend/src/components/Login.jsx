import React from "react";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${import.meta.env.VITE_API_URL}/user/login`, user)
      .then((res) => {
        const loggedInUser = res.data.user;

        localStorage.setItem("userId", loggedInUser.id);
        localStorage.setItem("uname", loggedInUser.uname);
        localStorage.setItem("email", loggedInUser.email);
        localStorage.setItem("role", loggedInUser.role);

        if (loggedInUser.role === "student") {
          navigate("/student");
        } else if (loggedInUser.role === "instructor") {
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err.response?.data?.message || "Login failed");
      });
  };

  return (
    <>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Login</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={user.email || ""}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
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
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="password">Password</label>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Login
                  </button>

                  <p className="text-center mb-0">
                    Not registered?{" "}
                    <NavLink to="/register">Create an account</NavLink>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
