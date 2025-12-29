const router = require("express").Router();
const {
  register,
  login,
  authMiddleware,
  getMe,
  updateMe,
  deleteMe,
  logoutWithPassword
} = require("../controllers/authController");

// Public
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.delete("/me", authMiddleware, deleteMe);

router.post("/logout", authMiddleware, logoutWithPassword);
module.exports = router;
