const router = require("express").Router();
const { markAttendance } = require("../controllers/attendanceController");
const auth = require("../middleware/authMiddleware");

router.post("/mark", auth, markAttendance);

module.exports = router;
