const Attendance = require("../models/Attendance");
const Activity = require("../models/Activity");
const Teacher = require("../models/Teacher");
const User = require("../models/User");

exports.bestTeacher = async (req, res) => {
  try {
    // 1. Aggregate attendance scores
    const attendance = await Attendance.aggregate([
      {
        $group: {
          _id: "$teacherId",
          attendanceScore: { $sum: "$score" }
        }
      }
    ]);

    // 2. Aggregate activity scores
    const activity = await Activity.aggregate([
      {
        $group: {
          _id: "$teacherId",
          taskScore: { $sum: "$taskScore" }
        }
      }
    ]);

    // 3. Calculate total scores for each teacher
    const teacherScores = attendance.map(a => {
      const act = activity.find(x => x._id.toString() === a._id.toString());
      const total = a.attendanceScore + (act ? act.taskScore : 0);
      return {
        teacherId: a._id,
        totalScore: total
      };
    });

    // 4. Sort by total score descending
    teacherScores.sort((a, b) => b.totalScore - a.totalScore);

    // 5. Handle ties: Find all teachers with the top score
    const topScore = teacherScores[0] ? teacherScores[0].totalScore : 0;
    const topTeachers = teacherScores.filter(t => t.totalScore === topScore);

    // 6. Fetch detailed information for top teachers
    const detailedTopTeachers = await Promise.all(
      topTeachers.map(async (t) => {
        // Find Teacher document with populated user reference
        const teacherDoc = await Teacher.findById(t.teacherId);
        
        let teacherName = "Name Not Set";
        let teacherEmail = null;
        let teacherCode = t.teacherId; // Default to database ID

        if (teacherDoc) {
          // Get teacher code from Teacher model
          teacherCode = teacherDoc.teacherId || t.teacherId;
          
          // Fetch user details for teacher name
          if (teacherDoc.userId) {
            const userDoc = await User.findById(teacherDoc.userId);
            if (userDoc) {
              teacherName = userDoc.fullName;
              teacherEmail = userDoc.email;
            }
          }
        }

        return {
          teacherId: t.teacherId,
          teacherCode: teacherCode,
          teacherName: teacherName,
          totalScore: t.totalScore,
          email: teacherEmail
        };
      })
    );

    // 7. Return the results
    res.json({
      topScore: topScore,
      isTie: detailedTopTeachers.length > 1,
      topTeachers: detailedTopTeachers,
      generatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error("Error in bestTeacher report:", err);
    res.status(500).json({ 
      error: "Internal server error while generating report",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};