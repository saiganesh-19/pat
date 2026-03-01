const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getActiveSession } = require("../controllers/studentSession.controller");

router.get("/active-session", authMiddleware, getActiveSession);

module.exports = router;
