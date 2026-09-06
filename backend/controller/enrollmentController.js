const enrollmentModel = require("../model/enrollmentModel")
const { itemModel } = require("../model/model")
const lessonModel = require("../model/lessonModel")
const { awardBadge } = require("./badgeController")

exports.enrollCourse = async (req, resp) => {
    try {
        const { courseId, studentId } = req.body

        const course = await itemModel.findById(courseId)

        if (!course) {
            return resp.status(404).json({
                message: "Course not found"
            })
        }

        if (Number(course.price) > 0) {
            return resp.status(403).json({
                message: "This is a paid course. Please complete payment first."
            })
        }

        const existingEnrollment = await enrollmentModel.findOne({
            studentId,
            courseId
        })

        if (existingEnrollment) {
            return resp.status(400).json({
                message: "Already enrolled in this course"
            })
        }

        const enrollment = await enrollmentModel.create({
            studentId,
            courseId,
            completedLessons: [],
            progress: 0
        })

        resp.status(201).json({
            message: "Course enrolled successfully",
            enrollment
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            message: "Enrollment failed"
        })
    }
}

exports.getMyCourses = async (req, resp) => {
    try {
        const studentId = req.params.studentId

        const enrollments = await enrollmentModel
            .find({ studentId })
            .populate("courseId")

        const courses = await Promise.all(
            enrollments.map(async (enrollment) => {
                if (!enrollment.courseId) {
                    return null
                }

                const courseId = enrollment.courseId._id

                const lessons = await lessonModel
                    .find({ courseId })
                    .select("_id")

                const validLessonIds = new Set(
                    lessons.map((lesson) => String(lesson._id))
                )

                const completedLessonIds = [
                    ...new Set(
                        enrollment.completedLessons
                            .map((id) => String(id))
                            .filter((id) => validLessonIds.has(id))
                    )
                ]

                const totalLessons = lessons.length
                const completedLessonCount = completedLessonIds.length

                const progress = totalLessons === 0
                    ? 0
                    : Math.round(
                        (completedLessonCount / totalLessons) * 100
                    )

                return {
                    enrollmentId: enrollment._id,
                    courseId: courseId,
                    courseName: enrollment.courseId.courseName,
                    instructor: enrollment.courseId.instructor,
                    category: enrollment.courseId.category,
                    image: enrollment.courseId.image,
                    level: enrollment.courseId.level,
                    duration: enrollment.courseId.duration,
                    progress: Math.min(progress, 100),
                    completedLessons: completedLessonIds,
                    completedLessonCount,
                    totalLessons,
                    enrolledAt: enrollment.enrolledAt
                }
            })
        )

        resp.status(200).json(
            courses.filter((course) => course !== null)
        )

    } catch (error) {
        console.log(error)
        resp.status(500).json({
            message: "Failed to fetch enrolled courses"
        })
    }
}

exports.completeLesson = async (req, resp) => {
    try {
        const {
            lessonId,
            courseId,
            studentId,
            watchedPercentage
        } = req.body

        const enrollment = await enrollmentModel.findOne({
            studentId,
            courseId
        })

        if (!enrollment) {
            return resp.status(404).json({
                message: "Enrollment not found"
            })
        }

        const lesson = await lessonModel.findOne({
            _id: lessonId,
            courseId
        })

        if (!lesson) {
            return resp.status(404).json({
                message: "Lesson not found for this course"
            })
        }

        if (Number(watchedPercentage) < 80) {
            return resp.status(403).json({
                message: "You must watch at least 80% of the lesson video before completing it."
            })
        }

        const completedLessonIds = enrollment.completedLessons.map(
            (id) => String(id)
        )

        if (!completedLessonIds.includes(String(lessonId))) {
            enrollment.completedLessons.push(lessonId)
        }

        const lessons = await lessonModel
            .find({ courseId })
            .select("_id")

        const validLessonIds = new Set(
            lessons.map((lesson) => String(lesson._id))
        )

        const uniqueCompletedLessonIds = [
            ...new Set(
                enrollment.completedLessons
                    .map((id) => String(id))
                    .filter((id) => validLessonIds.has(id))
            )
        ]

        const totalLessons = lessons.length
        const completedLessonCount = uniqueCompletedLessonIds.length

        const progress = totalLessons === 0
            ? 0
            : Math.round(
                (completedLessonCount / totalLessons) * 100
            )

        enrollment.completedLessons = uniqueCompletedLessonIds
        enrollment.progress = Math.min(progress, 100)

        await enrollment.save()

        // Check total lessons completed by the student
        const allEnrollments = await enrollmentModel.find({ studentId })

        const totalCompletedLessons = [
            ...new Set(
                allEnrollments.flatMap((enrollment) =>
                    enrollment.completedLessons.map(
                        (id) => String(id)
                    )
                )
            )
        ]

        if (totalCompletedLessons.length >= 10) {
            await awardBadge(
                studentId,
                "Lesson Explorer",
                "Completed 10 lessons",
                "🔥"
            )
        }

        // Course completion badges
        if (enrollment.progress === 100) {
            const completedCourses =
                await enrollmentModel.countDocuments({
                    studentId,
                    progress: 100
                })

            if (completedCourses >= 1) {
                await awardBadge(
                    studentId,
                    "First Course",
                    "Completed your first course",
                    "🏆"
                )
            }

            if (completedCourses >= 3) {
                await awardBadge(
                    studentId,
                    "Dedicated Learner",
                    "Completed 3 courses",
                    "📚"
                )
            }

            if (completedCourses >= 5) {
                await awardBadge(
                    studentId,
                    "SkillsHub Achiever",
                    "Completed 5 courses",
                    "⭐"
                )
            }

            if (completedCourses >= 10) {
                await awardBadge(
                    studentId,
                    "SkillsHub Champion",
                    "Completed 10 courses",
                    "⭐⭐"
                )
            }

            if (completedCourses >= 20) {
                await awardBadge(
                    studentId,
                    "SkillsHub Legend",
                    "Completed 20 courses",
                    "⭐⭐⭐"
                )
            }
        }

        resp.status(200).json({
            message: "Lesson completed",
            progress: enrollment.progress,
            completedLessonCount,
            totalLessons
        })

    } catch (error) {
        console.log(error)

        resp.status(500).json({
            message: "Failed to update progress"
        })
    }
}