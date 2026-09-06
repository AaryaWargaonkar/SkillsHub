import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({
    uname: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setUser({
      uname: localStorage.getItem("uname") || "",
      email: localStorage.getItem("email") || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user.newPassword && !user.currentPassword) {
      alert("Please enter your current password");
      return;
    }

    if (user.newPassword !== user.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    const data = {
      uname: user.uname,
      email: user.email,
      currentPassword: user.currentPassword,
      newPassword: user.newPassword,
    };

    axios
      .put(`http://localhost:4000/user/update-profile/${userId}`, data)
      .then((res) => {
        localStorage.removeItem("userId");
        localStorage.removeItem("uname");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("token");

        alert("Profile updated successfully. Please login again.");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response?.data?.message || "Failed to update profile");
      });
  };

  return (
    <>
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#dcf8c9", minHeight: "100vh" }}
      >
        <div className="container pt-3">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 ">
                  <h2 className="mb-1">My Profile</h2>
                  <p className="text-muted mb-4">
                    Manage your account information and password.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        name="uname"
                        className="form-control"
                        value={user.uname}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={user.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <hr className="mb-4" />

                    <h5 className="mb-3">Change Password</h5>

                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-control"
                        value={user.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        value={user.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={user.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;