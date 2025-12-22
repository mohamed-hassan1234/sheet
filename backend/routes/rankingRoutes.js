const router = require("express").Router();
const { getFullRankingDetailed } = require("../controllers/rankingController");
const auth = require("../middleware/authMiddleware");

router.get("/full-detailed", auth, getFullRankingDetailed);

module.exports = router;
