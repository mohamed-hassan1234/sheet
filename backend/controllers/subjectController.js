const Subject = require("../models/Subject");

/* =====================
   CREATE SUBJECT
===================== */
exports.createSubject = async (req, res) => {
  try {
    const { subjectName } = req.body;

    if (!subjectName)
      return res.status(400).json({ error: "Subject name is required" });

    const exists = await Subject.findOne({ subjectName });
    if (exists)
      return res.status(400).json({ error: "Subject already exists" });

    const subject = await Subject.create({ subjectName });

    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================
   GET ALL SUBJECTS
===================== */
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================
   UPDATE SUBJECT
===================== */
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { subjectName: req.body.subjectName },
      { new: true }
    );

    if (!subject)
      return res.status(404).json({ error: "Subject not found" });

    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================
   DELETE SUBJECT
===================== */
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject)
      return res.status(404).json({ error: "Subject not found" });

    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
