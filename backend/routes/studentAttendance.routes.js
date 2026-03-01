const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { markAttendance } = require("../controllers/studentAttendance.controller");

router.post("/mark-attendance", authMiddleware, markAttendance);

module.exports = router;
