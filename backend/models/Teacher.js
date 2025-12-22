const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  teacherId: {
    type: String,
    unique: true
  },

  classIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    }
  ],

  status: {
    type: String,
    default: "active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Teacher", teacherSchema);
