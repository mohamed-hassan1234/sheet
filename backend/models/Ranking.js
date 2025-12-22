const mongoose = require("mongoose");

const rankingSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  
  teacherCode: {
    type: String,
    required: true
  },

  teacherName: {
    type: String,
    default: "Unknown Teacher"
  },

  week: {
    type: String
  },

  month: {
    type: String
  },

  attendanceScore: {
    type: Number,
    default: 0
  },

  taskScore: {
    type: Number,
    default: 0
  },

  totalScore: {
    type: Number,
    default: 0
  },

  rank: {
    type: Number
  },

  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Ranking", rankingSchema);