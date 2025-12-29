const router = require("express").Router();
const { getTeacherDashboard } = require("../controllers/teacherDashboardController");
const { authMiddleware } = require("../controllers/authController");

// Teacher dashboard
router.get("/dashboard", authMiddleware, getTeacherDashboard);

module.exports = router;
