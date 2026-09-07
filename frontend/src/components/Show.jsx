import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router-dom'

const Show = () => {
  const [item,setItem]=useState({})
  const {id}=useParams()
  const navigate=useNavigate()

  useEffect(()=>{
    const instructorId=localStorage.getItem("userId")

    axios
      .get(`${import.meta.env.VITE_API_URL}/instructor-show/${id}?instructorId=${instructorId}`)
      .then((res)=>setItem(res.data))
      .catch((err)=>{
        console.log(err)
        alert(err.response?.data?.message || "You cannot view this course")
        navigate("/home")
      })
  },[id,navigate])

  const handleDelete=()=>{
    const instructorId=localStorage.getItem("userId")

    if(window.confirm("Are you sure you want to delete this course?")){
      axios
        .delete(`${import.meta.env.VITE_API_URL}/delete/${id}?instructorId=${instructorId}`)
        .then((res)=>{
          alert(res.data.message)
          navigate("/home")
        })
        .catch((err)=>{
          console.log(err)
          alert(err.response?.data?.message || "Failed to delete course")
        })
    }
  }

  return (
    <>
      <div
        className="container-fluid py-5"
        style={{backgroundColor:"#f6e7c1",minHeight:"100vh"}}
      >
        <div className="container pt-5">
          <div
            className="card border-0 shadow-sm overflow-hidden "
            style={{backgroundColor:"#fffaf0"}}
          >
            <div className="row g-0">
              <div className="col-md-5 p-4">
                <img
                  src={item.image}
                  className="img-fluid rounded"
                  alt={item.courseName}
                  style={{width:"100%",height:"330px",objectFit:"cover"}}
                />
              </div>

              <div className="col-md-7">
                <div className="card-body p-5">
                  <h1 className="mb-4">{item.courseName}</h1>

                  <p className="fs-5"><strong>Instructor:</strong> {item.instructor}</p>
                  <p className="fs-5"><strong>Category:</strong> {item.category}</p>
                  <p className="fs-5"><strong>Duration:</strong> {item.duration} months</p>
                  <p className="fs-5"><strong>Level:</strong> {item.level}</p>
                  <p className="fs-5 mb-4"><strong>Students Enrolled:</strong> {item.studentCount}</p>

                  <NavLink className="btn btn-secondary me-2" to="/home">
                    Back to Home
                  </NavLink>

                  <NavLink className="btn btn-warning me-2" to={`/edit/${item._id}`}>
                    Edit
                  </NavLink>

                  <button className="btn btn-danger me-2" onClick={handleDelete}>
                    Delete
                  </button>

                  <NavLink className="btn btn-success" to={`/add-lesson/${item._id}`}>
                    Add Lesson
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Show
