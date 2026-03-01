const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getSummary } = require("../controllers/studentSummary.controller");

router.get("/summary", auth, getSummary);

module.exports = router;
