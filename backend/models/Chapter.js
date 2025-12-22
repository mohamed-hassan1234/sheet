const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  subjectId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Subject",
  required: true
},


  chapterName: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chapter", chapterSchema);
