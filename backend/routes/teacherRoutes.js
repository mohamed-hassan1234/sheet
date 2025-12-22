const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  getAllTeachers,
  assignClassAndSubject,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  getMySubjectByClass,
  getMyClasses
} = require("../controllers/teacherController");

router.get("/", auth, getAllTeachers);
router.post("/assign", auth, assignClassAndSubject);
router.get("/assignments", auth, getAssignments);
router.put("/assignments/:id", auth, updateAssignment);
router.delete("/assignments/:id", auth, deleteAssignment);

router.get("/my-subject/:classId", auth, getMySubjectByClass);
router.get("/my-classes", auth, getMyClasses);
module.exports = router;
