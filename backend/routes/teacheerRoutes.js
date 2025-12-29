const express = require("express");
const router = express.Router();
const {
  registerTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  resetTeacherPassword
} = require("../controllers/teacheerController");

// CRUD
router.post("/register", registerTeacher);
router.get("/", getAllTeachers);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

// RESET PASSWORD
router.put("/:id/reset-password", resetTeacherPassword);

module.exports = router;
