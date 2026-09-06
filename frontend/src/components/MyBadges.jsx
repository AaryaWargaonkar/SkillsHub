import React, { useEffect, useState } from "react"
import axios from "axios"
import StudentNavbar from "./StudentNavbar"

const MyBadges = () => {
    const [badges, setBadges] = useState([])
    const studentId = localStorage.getItem("userId")

    const allBadges = [
        {
            name: "First Course",
            description: "Completed your first course",
            icon: "🏆"
        },
        {
            name: "Dedicated Learner",
            description: "Completed 3 courses",
            icon: "📚"
        },
        {
            name: "Lesson Explorer",
            description: "Completed 10 lessons",
            icon: "🔥"
        },
        {
            name: "SkillsHub Achiever",
            description: "Completed 5 courses",
            icon: "⭐"
        },
        {
            name: "SkillsHub Champion",
            description: "Completed 10 courses",
            icon: "⭐⭐"
        },
        {
            name: "SkillsHub Legend",
            description: "Completed 20 courses",
            icon: "⭐⭐⭐"
        }
    ]

    useEffect(() => {
        if (!studentId) return

        axios.get(`http://localhost:4000/badge/my-badges/${studentId}`)
            .then((res) => setBadges(res.data))
            .catch((err) => console.log(err))
    }, [studentId])

    const isEarned = (badgeName) => {
        return badges.some((badge) => badge.badgeName === badgeName)
    }

    return (
        <>
            <StudentNavbar />

            <div
                className="container-fluid py-5"
                style={{ backgroundColor: "#e0ebfc", minHeight: "100vh" }}
            >
                <div className="container">
                    <div className="mb-4">
                        <h2 className="mb-1 pt-3">🏅 My Badges</h2>
                        <p className="text-muted mb-0">
                            Complete courses and lessons to unlock achievements.
                        </p>
                    </div>

                    <div className="row g-4">
                        {allBadges.map((badge) => {
                            const earned = isEarned(badge.name)

                            return (
                                <div className="col-md-4" key={badge.name}>
                                    <div
                                        className={`card h-100 text-center border-0 shadow-sm ${
                                            earned ? "border-success" : ""
                                        }`}
                                    >
                                        <div className="card-body py-4">
                                            <div
                                                style={{
                                                    fontSize: "55px",
                                                    opacity: earned ? 1 : 0.3
                                                }}
                                            >
                                                {badge.icon}
                                            </div>

                                            <h5 className="mt-3 mb-2">
                                                {badge.name}
                                            </h5>

                                            <p className="text-muted small mb-3">
                                                {badge.description}
                                            </p>

                                            {earned ? (
                                                <span className="badge bg-success px-3 py-2">
                                                    ✓ Earned
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary px-3 py-2">
                                                    🔒 Locked
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyBadges