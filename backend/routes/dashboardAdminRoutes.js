const router = require("express").Router();
const { getAdminDashboard } = require("../controllers/dashboardAdminController");
const { authMiddleware } = require("../controllers/authController");

// Admin only (role check optional haddii aad rabto)
router.get("/admin/dashboard", authMiddleware, getAdminDashboard);

module.exports = router;
