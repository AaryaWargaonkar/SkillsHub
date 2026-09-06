import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";

const StudentDashboard = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [price, setPrice] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:4000/display")
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  }, []);

  const categories = [...new Set(items.map((item) => item.category))];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.courseName.toLowerCase().includes(searchText) ||
      item.instructor.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText);

    const matchesCategory = category === "All" || item.category === category;

    const matchesLevel =
      level === "All" ||
      item.level.trim().toLowerCase() === level.toLowerCase();

    const matchesPrice =
      price === "All" ||
      (price === "Free" && Number(item.price) === 0) ||
      (price === "Paid" && Number(item.price) > 0);

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
    setPrice("All");
  };

  return (
    <>
      <StudentNavbar />

      <div
        className="container-fluid"
        style={{ backgroundColor: "#e0ebfc", minHeight: "100vh" }}
      >
        <div className="pt-5 px-5">
        <div className="mb-4">
          <h2 className="fw-bold ">Available Courses</h2>
          <p className="text-muted mb-0">
            Explore courses and build your skills.
          </p>
        </div>

        <div className="card border-0 shadow-sm p-3 ">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search courses, instructors, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="All">All Levels</option>
                {levels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              >
                <option value="All">All Prices</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div className="col-md-1">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="text-muted mb-0">
            Showing <strong>{filteredItems.length}</strong> course
            {filteredItems.length !== 1 ? "s" : ""}
          </p>
        </div>
      
        <div className="row">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <img
                    className="card-img-top"
                    src={item.image}
                    alt={item.courseName}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="card-title fw-semibold mb-0">
                        {item.courseName}
                      </h4>

                      <span
                        className={`badge ${Number(item.price) === 0 ? "bg-success" : "bg-primary"}`}
                      >
                        {Number(item.price) === 0 ? "Free" : `₹${item.price}`}
                      </span>
                    </div>

                    <p className="text-muted mb-2">By {item.instructor}</p>

                    <div className="mb-3">
                      <span className="badge bg-light text-dark border me-2">
                        {item.category}
                      </span>

                      <span className="badge bg-light text-dark border">
                        {item.level}
                      </span>
                    </div>

                    <div className="text-muted small mb-3">
                      <span className="me-3">🕒 {item.duration} months</span>

                      <span>⭐ {item.averageRating || 0}</span>
                    </div>

                    <NavLink
                      className="btn btn-primary mt-auto"
                      to={`/student-course/${item._id}`}
                    >
                      View Course
                    </NavLink>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <h4 className="fw-semibold">No courses found</h4>
              <p className="text-muted">Try changing your search or filters.</p>

              <button
                className="btn btn-outline-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default StudentDashboard;
