const router = require("express").Router();
const {
  addActivity,
  getMyActivities,
  updateActivity,
  deleteActivity
} = require("../controllers/activityController");
const auth = require("../middleware/authMiddleware");

// CRUD routes
router.post("/add", auth, addActivity);
router.get("/my", auth, getMyActivities);
router.put("/:id", auth, updateActivity);
router.delete("/:id", auth, deleteActivity);

module.exports = router;
