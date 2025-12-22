const Teacher = require("../models/Teacher");
const TeacherClassSubject = require("../models/TeacherClassSubject");

/* =========================
   GET ALL TEACHERS (ADMIN)
========================= */
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("userId", "fullName email");

    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ==============================
   ASSIGN CLASS + SUBJECT
============================== */
exports.assignClassAndSubject = async (req, res) => {
  try {
    const { teacherId, classId, subjectId } = req.body;

    if (!teacherId || !classId || !subjectId) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = await TeacherClassSubject.findOne({
      teacherId,
      classId,
      subjectId
    });

    if (exists)
      return res.status(400).json({ error: "Already assigned" });

    const assign = await TeacherClassSubject.create({
      teacherId,
      classId,
      subjectId
    });

    res.status(201).json(assign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ==============================
   VIEW ASSIGNED (ADMIN)
============================== */
exports.getAssignments = async (req, res) => {
  try {
    const data = await TeacherClassSubject.find()
      .populate({
        path: "teacherId",
        populate: { path: "userId", select: "fullName email" }
      })
      .populate("classId", "className")
      .populate("subjectId", "subjectName");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ==============================
   UPDATE ASSIGNMENT
============================== */
exports.updateAssignment = async (req, res) => {
  try {
    const { classId, subjectId } = req.body;

    const updated = await TeacherClassSubject.findByIdAndUpdate(
      req.params.id,
      { classId, subjectId },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ==============================
   DELETE ASSIGNMENT
============================== */
exports.deleteAssignment = async (req, res) => {
  try {
    await TeacherClassSubject.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ======================================
   GET MY SUBJECT BY CLASS
   /teachers/my-subject/:classId
====================================== */
exports.getMySubjectByClass = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const assign = await TeacherClassSubject.findOne({
      teacherId: teacher._id,
      classId: req.params.classId
    }).populate("subjectId", "subjectName");

    if (!assign) return res.json(null);

    res.json(assign.subjectId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ===================== GET MY CLASSES ===================== */
exports.getMyClasses = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const assignments = await TeacherClassSubject.find({
      teacherId: teacher._id
    }).populate("classId", "className");

    // ka saar duplicates
    const classes = [];
    const seen = new Set();

    assignments.forEach(a => {
      if (!seen.has(a.classId._id.toString())) {
        seen.add(a.classId._id.toString());
        classes.push(a.classId);
      }
    });

    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};