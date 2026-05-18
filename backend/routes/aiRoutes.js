const express = require("express");

const router = express.Router();

const { generateAIText } = require("../controllers/aiController");


// 🔥 IMPORT AUTH MIDDLEWARE
const authMiddleware = require("../middleware/authMiddleware");


// 🔥 PROTECTED AI ROUTE
router.post(
  "/generate",
  authMiddleware,
  generateAIText
);

module.exports = router;