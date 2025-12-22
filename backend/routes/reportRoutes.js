const router = require("express").Router();
const { bestTeacher } = require("../controllers/reportController");
const auth = require("../middleware/authMiddleware");

// Route to get best teacher(s) with detailed information
router.get("/best-teacher", auth, bestTeacher);

module.exports = router;