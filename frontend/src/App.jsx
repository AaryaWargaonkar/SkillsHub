import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Add from "./components/Add";
import Edit from "./components/Edit";
import Show from "./components/Show";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import StudentCourseDetails from "./components/StudentCourseDetails";
import MyCourses from "./components/MyCourses";
import AddLesson from "./components/AddLesson";
import LearnCourse from "./components/LearnCourse";
import InstructorMyCourses from "./components/InstructorMyCourses";
import EditLesson from "./components/EditLesson";
import InstructorReviews from "./components/InstructorReviews";
import StudentProgress from "./components/StudentProgress";
import Certificate from "./components/Certificate";
import StudentQuiz from "./components/StudentQuiz";
import ManageQuiz from "./components/ManageQuiz";
import MyBadges from "./components/MyBadges";
import Profile from "./components/Profile";
import StudentNavbar from "./components/StudentNavbar";

const Layout = () => {
  const location = useLocation();

  const isStudentPage =
    location.pathname.startsWith("/student") ||
    location.pathname === "/my-courses" ||
    location.pathname === "/progress" ||
    location.pathname.startsWith("/learn") ||
    location.pathname.startsWith("/certificate") ||
    location.pathname === "/badges";

  const isProfilePage = location.pathname === "/profile";

  const role = localStorage.getItem("role");

  return (
    <>
      {location.pathname !== "/" &&
        location.pathname !== "/register" &&
        location.pathname !== "/login" &&
        !isStudentPage &&
        !isProfilePage && <Navbar />}

      {isProfilePage && role === "student" && <StudentNavbar />}
      {isProfilePage && role === "instructor" && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/add" element={<Add />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/show/:id" element={<Show />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student-course/:id" element={<StudentCourseDetails />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/add-lesson/:id" element={<AddLesson />} />
        <Route path="/learn/:id" element={<LearnCourse />} />
        <Route path="/edit-lesson/:id" element={<EditLesson />} />
        <Route path="/my-instructor-courses" element={<InstructorMyCourses />} />
        <Route path="/instructor-reviews/:id" element={<InstructorReviews />} />
        <Route path="/progress" element={<StudentProgress />} />
        <Route path="/certificate/:id" element={<Certificate />} />
        <Route path="/student/quiz/:lessonId" element={<StudentQuiz />} />
        <Route path="/manage-quiz/:courseId/:lessonId" element={<ManageQuiz />} />
        <Route path="/badges" element={<MyBadges />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;