const express = require("express");
const router = express.Router();
const isAuth = localStorage.getItem("token");

const { generateAIText } = require("../controllers/aiController");

router.post("/generate", generateAIText);

module.exports = router;