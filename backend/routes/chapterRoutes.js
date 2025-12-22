const router = require("express").Router();
const { createChapter, getChaptersByClass, getMyChaptersByClass, updateChapter, deleteChapter } = require("../controllers/chapterController");
const auth = require("../middleware/authMiddleware");

router.post("/add", auth, createChapter);
router.get("/class/:classId", auth, getMyChaptersByClass);
router.put("/:id", auth, updateChapter);
router.delete("/:id", auth, deleteChapter);


module.exports = router;
