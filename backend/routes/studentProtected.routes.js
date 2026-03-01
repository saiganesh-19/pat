const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route working",
    student: req.user
  });
});

module.exports = router;
