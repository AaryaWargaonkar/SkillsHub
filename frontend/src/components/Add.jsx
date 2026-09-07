import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Add = () => {
  const [item, setItem] = useState({
    ID: "",
    courseName: "",
    instructor: "",
    instructorId: "",
    category: "",
    duration: "",
    level: "",
    price: "",
    image: "",
  });

  const [isFree, setIsFree] = useState(false);
  const navigate = useNavigate();

  const handleFreeChange = (e) => {
    const free = e.target.checked;
    setIsFree(free);

    if (free) {
      setItem({ ...item, price: 0 });
    } else {
      setItem({ ...item, price: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const instructorId = localStorage.getItem("userId");

    axios
      .post(`${import.meta.env.VITE_API_URL}/add`, { ...item, instructorId })
      .then(() => navigate("/home"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#f6e7c1", minHeight: "100vh" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <h2 className="mb-4 pt-3">Add Course</h2>

              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: "#fffaf0",
                  border: "1px solid #c99a24",
                }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      name="ID"
                      id="ID"
                      placeholder=""
                      onChange={(e) =>
                        setItem({ ...item, ID: e.target.value })
                      }
                    />
                    <label htmlFor="ID">Id</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="courseName"
                      id="courseName"
                      placeholder=""
                      onChange={(e) =>
                        setItem({ ...item, courseName: e.target.value })
                      }
                    />
                    <label htmlFor="courseName">Course Name</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="instructor"
                      id="instructor"
                      placeholder=""
                      onChange={(e) =>
                        setItem({ ...item, instructor: e.target.value })
                      }
                    />
                    <label htmlFor="instructor">Instructor</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="category"
                      id="category"
                      placeholder=""
                      onChange={(e) =>
                        setItem({ ...item, category: e.target.value })
                      }
                    />
                    <label htmlFor="category">Category</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      name="duration"
                      id="duration"
                      placeholder=""
                      onChange={(e) =>
                        setItem({ ...item, duration: e.target.value })
                      }
                    />
                    <label htmlFor="duration">Duration</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="level"
                      id="level"
                      placeholder=""
                      onChange={(e) =>
                        setItem({ ...item, level: e.target.value })
                      }
                    />
                    <label htmlFor="level">Level</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      id="price"
                      placeholder=""
                      value={item.price}
                      disabled={isFree}
                      onChange={(e) =>
                        setItem({ ...item, price: e.target.value })
                      }
                    />
                    <label htmlFor="price">Price (₹)</label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="freeCourse"
                      checked={isFree}
                      onChange={handleFreeChange}
                    />
                    <label className="form-check-label" htmlFor="freeCourse">
                      Free Course
                    </label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="image"
                      id="image"
                      placeholder=""
                      onChange={(e) =>
                        setItem({ ...item, image: e.target.value })
                      }
                    />
                    <label htmlFor="image">Thumbnail</label>
                  </div>

                  <NavLink
                    className="btn btn-secondary me-3 my-2"
                    to="/home"
                    role="button"
                  >
                    Back to Home
                  </NavLink>

                  <button
                    type="submit"
                    className="btn my-2"
                    style={{ backgroundColor: "#c99a24", color: "white" }}
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add;
