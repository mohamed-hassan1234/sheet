const router = require("express").Router();
const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass
} = require("../controllers/classController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, createClass);          // CREATE
router.get("/", auth, getClasses);             // READ ALL
router.get("/:id", auth, getClassById);        // READ ONE
router.put("/:id", auth, updateClass);         // UPDATE
router.delete("/:id", auth, deleteClass);      // DELETE

module.exports = router;
