const Class = require("../models/Class");

/* =====================
   CREATE CLASS
===================== */
exports.createClass = async (req, res) => {
  try {
    const { className } = req.body;

    const newClass = await Class.create({ className });

    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================
   READ ALL CLASSES
===================== */
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================
   READ SINGLE CLASS
===================== */
exports.getClassById = async (req, res) => {
  try {
    const singleClass = await Class.findById(req.params.id);
    res.json(singleClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================
   UPDATE CLASS
===================== */
exports.updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { className: req.body.className },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================
   DELETE CLASS
===================== */
exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
