const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },

  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["Excellent", "Good", "Late"],
    required: true
  },

  score: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
