const router = require("express").Router();

const multer = require("multer");
const { verifyAdmin } = require("../middleware/auth.middleware");
const {
  addSemesterSchedule,
} = require("../controllers/semesterSchedule.controller");
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/create",
  verifyAdmin,
  upload.single("schedule_file"),
  addSemesterSchedule
);

module.exports = router;
