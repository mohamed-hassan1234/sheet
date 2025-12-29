const Teacher = require("../models/Teacher");
const Attendance = require("../models/Attendance");
const Activity = require("../models/Activity");
const Ranking = require("../models/Ranking");
const User = require("../models/User");

// =======================
// TEACHER DASHBOARD
// =======================
exports.getTeacherDashboard = async (req, res) => {
  try {
    // user id from token
    const userId = req.user.id;

    // get teacher
    const teacher = await Teacher.findOne({ userId })
      .populate("userId", "fullName email");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Attendance stats
    const attendanceStats = await Attendance.aggregate([
      { $match: { teacherId: teacher._id } },
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 }
        }
      }
    ]);

    // Activities count
    const activitiesCount = await Activity.countDocuments({
      teacherId: teacher._id
    });

    // Ranking info (optional)
    const ranking = await Ranking.findOne({ teacherId: teacher._id })
      .sort({ createdAt: -1 });

    res.json({
      teacher: {
        id: teacher._id,
        teacherCode: teacher.teacherId,
        fullName: teacher.userId.fullName,
        email: teacher.userId.email,
        status: teacher.status
      },
      summary: {
        activities: activitiesCount
      },
      attendanceStats,
      ranking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
