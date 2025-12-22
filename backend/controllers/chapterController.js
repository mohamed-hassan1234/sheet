const Chapter = require("../models/Chapter");
const Teacher = require("../models/Teacher");
const mongoose = require("mongoose");
const TeacherClassSubject = require("../models/TeacherClassSubject"); 

exports.createChapter = async (req, res) => {
  try {
    const { classId, chapterName, subjectId } = req.body;

    if (!classId || !chapterName || !subjectId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // hubi assignment
    const assign = await TeacherClassSubject.findOne({
      teacherId: teacher._id,
      classId,
      subjectId
    });

    if (!assign) {
      return res
        .status(403)
        .json({ error: "Not assigned to this class & subject" });
    }

    const chapter = await Chapter.create({
      classId,
      subjectId,
      chapterName,
      teacherId: teacher._id
    });

    res.status(201).json(chapter);
  } catch (err) {
    console.error("CREATE CHAPTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.getMyChaptersByClass = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.json([]);

    const chapters = await Chapter.find({
      classId: req.params.classId,
      teacherId: teacher._id
    });

    res.json(chapters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// UPDATE
exports.updateChapter = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher)
      return res.status(404).json({ error: "Teacher not found" });

    const chapter = await Chapter.findOneAndUpdate(
      { _id: req.params.id, teacherId: teacher._id },
      { chapterName: req.body.chapterName },
      { new: true }
    );

    if (!chapter)
      return res.status(403).json({ error: "Not allowed" });

    res.json(chapter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// DELETE
exports.deleteChapter = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher)
      return res.status(404).json({ error: "Teacher not found" });

    const chapter = await Chapter.findOneAndDelete({
      _id: req.params.id,
      teacherId: teacher._id
    });

    if (!chapter)
      return res.status(403).json({ error: "Not allowed" });

    res.json({ message: "Chapter deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

