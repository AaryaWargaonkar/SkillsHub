const lessonModel = require("../model/lessonModel");

exports.addLesson = async (req, resp) => {
  try {
    const { courseId, title, description, videoUrl, order } = req.body;

    const lesson = await lessonModel.create({
      courseId,
      title,
      description,
      videoUrl,
      order,
    });

    resp.status(201).json({
      message: "Lesson added successfully",
      lesson,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Failed to add lesson" });
  }
};
exports.getLessons = async (req, resp) => {
  try {
    const { courseId } = req.params;

    const lessons = await lessonModel.find({ courseId }).sort({ order: 1 });

    resp.status(200).json(lessons);
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Failed to fetch lessons" });
  }
};
exports.updateLesson = async (req, resp) => {
  try {
    const { title, description, videoUrl, order } = req.body;

    const lesson = await lessonModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        videoUrl,
        order,
      },
      { new: true },
    );

    if (lesson) {
      resp.status(200).json({
        message: "Lesson updated successfully",
        lesson,
      });
    } else {
      resp.status(404).json({
        message: "Lesson not found",
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Failed to update lesson",
    });
  }
};
exports.getLessonById = async (req, resp) => {
  try {
    const lesson = await lessonModel.findById(req.params.id);

    if (lesson) {
      resp.status(200).json(lesson);
    } else {
      resp.status(404).json({ message: "Lesson not found" });
    }
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Failed to fetch lesson" });
  }
};
exports.deleteLesson = async (req, resp) => {
  try {
    await lessonModel.findByIdAndDelete(req.params.id);

    resp.status(200).json({
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Failed to delete lesson" });
  }
};
