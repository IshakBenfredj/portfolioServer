const express = require("express");
const router = express.Router();
const {
  addMeeting,
  getMeetings,
  updateMeetingStatus,
  deleteMeeting,
} = require("../controllers/meeting-controller");

router.get("/", getMeetings);
router.post("/", addMeeting);
router.put("/:id/status", updateMeetingStatus);
router.delete("/:id", deleteMeeting);

module.exports = router;
