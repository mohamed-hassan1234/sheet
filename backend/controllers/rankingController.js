const Attendance = require("../models/Attendance");
const Activity = require("../models/Activity");
const Teacher = require("../models/Teacher");
const TeacherClassSubject = require("../models/TeacherClassSubject");
const Subject = require("../models/Subject");
const Class = require("../models/Class");
const Chapter = require("../models/Chapter");

exports.getFullRankingDetailed = async (req, res) => {
  try {
    // 1️⃣ All teachers
    const teachers = await Teacher.find().populate("userId", "fullName email");

    // 2️⃣ Attendance aggregation
    const attendanceAgg = await Attendance.aggregate([
      { $group: { _id: "$teacherId", attendanceScore: { $sum: "$score" } } }
    ]);

    // 3️⃣ Activities with populated fields
    const allActivities = await Activity.find()
      .populate({ path: "teacherId", select: "userId" })
      .populate({ path: "classId", select: "className" })
      .populate({ path: "subjectId", select: "subjectName" }) // ✅ populate subjectName
      .populate({ path: "chapterId", select: "chapterName" })
      .sort({ createdAt: -1 });

    const result = teachers.map(t => {
      const att = attendanceAgg.find(a => a._id.toString() === t._id.toString());

      // Activities for this teacher
      const teacherActivities = allActivities
        .filter(a => a.teacherId._id.toString() === t._id.toString())
        .map(a => ({
          activityName: a.activityName || "No Activity Name", // ✅ default value
          score: a.taskScore,
          createdAt: a.createdAt,
          className: a.classId?.className || "Unknown Class",
          subjectName: a.subjectId?.subjectName || "Unknown Subject", // ✅ populate properly
          chapterName: a.chapterId?.chapterName || "Unknown Chapter"
        }));

      const attendanceScore = att?.attendanceScore || 0;
      const taskScore = teacherActivities.reduce((acc, act) => acc + act.score, 0);

      return {
        teacherId: t._id,
        teacherName: t.userId?.fullName || "Unknown",
        email: t.userId?.email || "N/A",
        attendanceScore,
        taskScore,
        totalScore: attendanceScore + taskScore,
        totalActivities: teacherActivities.length,
        lastPostedAt: teacherActivities[0]?.createdAt || null,
        activities: teacherActivities
      };
    });

    // Sort and rank
    result.sort((a, b) => b.totalScore - a.totalScore);
    const ranked = result.map((r, i) => ({ rank: i + 1, ...r }));

    res.json(ranked);

  } catch (err) {
    console.error("RANK DETAILED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
