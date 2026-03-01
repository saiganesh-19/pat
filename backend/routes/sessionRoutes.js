const express = require("express");
const router = express.Router();



const {
  startSession,
  getActiveSession,
  endSession,
  getSessionHistory,
  manualAttendance,
  getTodaySummary,
} = require("../controllers/sessionController");

// Start session
router.post("/start", startSession);

// Active session (dashboard)
router.get("/active/:teacherId", getActiveSession);

// End session
router.post("/end/:sessionId", endSession);

// Session history
router.get("/history/:teacherId", getSessionHistory);

// Manual attendance
router.put("/:sessionId/attendance/:studentId", manualAttendance);
router.get("/today-summary/:teacherId", getTodaySummary);


module.exports = router;
