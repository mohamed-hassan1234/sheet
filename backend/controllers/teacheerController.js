const User = require("../models/User");
const Teacher = require("../models/Teacher");
const TeacherClassSubject = require("../models/TeacherClassSubject");
const bcrypt = require("bcryptjs");

/* =========================
   REGISTER TEACHER (ADMIN)
   Password default: 1234
========================= */
exports.registerTeacher = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash("1234", 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "teacher"
    });

    const teacher = await Teacher.create({
      userId: user._id,
      teacherId: "TCH-" + Date.now()
    });

    res.status(201).json({
      message: "Teacher registered successfully",
      teacher,
      defaultPassword: "1234"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

/* =========================
   UPDATE TEACHER (ADMIN)
========================= */
exports.updateTeacher = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher)
      return res.status(404).json({ error: "Teacher not found" });

    await User.findByIdAndUpdate(teacher.userId, {
      fullName,
      email
    });

    res.json({ message: "Teacher updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   DELETE TEACHER (ADMIN)
========================= */
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher)
      return res.status(404).json({ error: "Teacher not found" });

    await TeacherClassSubject.deleteMany({ teacherId: teacher._id });
    await User.findByIdAndDelete(teacher.userId);
    await Teacher.findByIdAndDelete(teacher._id);

    res.json({ message: "Teacher deleted successfully" });
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
   GET ASSIGNMENTS (ADMIN)
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


/* =========================
   RESET TEACHER PASSWORD (ADMIN)
   Back to default: 1234
========================= */
exports.resetTeacherPassword = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const hashedPassword = await bcrypt.hash("1234", 10);

    await User.findByIdAndUpdate(teacher.userId, {
      password: hashedPassword
    });

    res.json({
      message: "Teacher password reset to default (1234)"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
