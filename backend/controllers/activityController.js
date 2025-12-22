const Activity = require("../models/Activity");
const Teacher = require("../models/Teacher");

// ADD ACTIVITY
exports.addActivity = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    if (!req.body.subjectId || !req.body.classId || !req.body.chapterId || !req.body.activityName)
      return res.status(400).json({ error: "All fields are required" });

    const activity = await Activity.create({
      teacherId: teacher._id,
      classId: req.body.classId,
      subjectId: req.body.subjectId,
      chapterId: req.body.chapterId,
      activityName: req.body.activityName,
      taskScore: 2
    });

    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET MY ACTIVITIES
exports.getMyActivities = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.json([]);

    const activities = await Activity.find({ teacherId: teacher._id })
      .populate("classId", "className")
      .populate("chapterId", "chapterName")
      .populate("subjectId", "subjectName");

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ACTIVITY
exports.updateActivity = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, teacherId: teacher._id },
      { activityName: req.body.activityName },
      { new: true }
    );

    if (!activity) return res.status(403).json({ error: "Not allowed" });

    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE ACTIVITY
exports.deleteActivity = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      teacherId: teacher._id
    });

    if (!activity) return res.status(403).json({ error: "Not allowed" });

    res.json({ message: "Activity deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
