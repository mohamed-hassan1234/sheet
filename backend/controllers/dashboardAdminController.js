const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Activity = require("../models/Activity");
const Attendance = require("../models/Attendance");
const Ranking = require("../models/Ranking");

// ================= ADMIN DASHBOARD SUMMARY =================
exports.getAdminDashboard = async (req, res) => {
  try {
    const teachersCount = await Teacher.countDocuments();
    const classesCount = await Class.countDocuments();
    const subjectsCount = await Subject.countDocuments();
    const chaptersCount = await Chapter.countDocuments();
    const activitiesCount = await Activity.countDocuments();

    const attendanceStats = await Attendance.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 }
        }
      }
    ]);

    const rankings = await Ranking.find()
      .sort({ totalScore: -1 })
      .limit(10);

    res.json({
      summary: {
        teachers: teachersCount,
        classes: classesCount,
        subjects: subjectsCount,
        chapters: chaptersCount,
        activities: activitiesCount
      },
      attendanceStats,
      rankings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
