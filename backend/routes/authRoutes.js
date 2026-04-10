const express = require("express");
const router = express.Router();
const isAuth = localStorage.getItem("token");


const { signupUser, loginUser } = require("../controllers/authController");

// routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

module.exports = router;