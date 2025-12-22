const Attendance = require("../models/Attendance");
const Teacher = require("../models/Teacher");

exports.markAttendance = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const today = new Date().toISOString().split("T")[0];

    // Hubi in maanta hore loo xaadiray
    const exists = await Attendance.findOne({
      teacherId: teacher._id,
      date: today
    });
    if (exists) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    let status = "Late";
    let score = 1;

    if (hour === 7 && minute <= 40) {
      status = "Excellent";
      score = 3;
    } else if (hour === 7 && minute <= 50) {
      status = "Good";
      score = 2;
    }

    const attendance = await Attendance.create({
      teacherId: teacher._id,
      date: today,
      time: `${hour}:${minute}`,
      status,
      score
    });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
