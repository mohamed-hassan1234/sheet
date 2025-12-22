const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject
} = require("../controllers/subjectController");

router.post("/add", auth, createSubject);
router.get("/", auth, getSubjects);
router.put("/:id", auth, updateSubject);
router.delete("/:id", auth, deleteSubject);

module.exports = router;
