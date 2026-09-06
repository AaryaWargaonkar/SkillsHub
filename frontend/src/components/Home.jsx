import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const instructorId = localStorage.getItem("userId");

    axios
      .get(`http://localhost:4000/display?instructorId=${instructorId}`)
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#f6e7c1", minHeight: "100vh" }}
      >
        <div className="container">
          <div className="mb-3">
            <h2 className="mb-1 pt-4">Instructor Dashboard</h2>
            <p className="text-muted mb-0">
              Explore courses and manage your learning content.
            </p>
          </div>

          <div className="row g-4">
            {items.map((item) => (
              <div className="col-md-4" key={item._id}>
                <div className="card h-100 border-4 shadow-lg overflow-hidden">
                  <img
                    className="card-img-top"
                    src={item.image}
                    alt={item.courseName}
                    style={{ height: "230px", objectFit: "cover" }}
                  />

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-3">{item.courseName}</h5>

                    <p className="card-text mb-2">
                      <strong>Instructor:</strong> {item.instructor}
                    </p>

                    <p className="card-text mb-2">
                      <strong>Category:</strong> {item.category}
                    </p>

                    <p className="card-text mb-2">
                      <strong>Duration:</strong> {item.duration} months
                    </p>

                    <div className="mb-2">
                      <span className="me-2">
                        ⭐ {item.averageRating} / 5
                      </span>
                      <small className="text-muted">
                        ({item.totalReviews} Reviews)
                      </small>
                    </div>

                    <p className="card-text mb-3">
                      <strong>Students Enrolled:</strong>{" "}
                      {item.studentCount}
                    </p>

                    {item.isOwner && (
                      <div className="mt-auto">
                        <NavLink
                          className="btn btn-secondary w-100"
                          to={`/show/${item._id}`}
                        >
                          View Course
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;