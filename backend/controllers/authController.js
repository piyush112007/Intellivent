const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 🔥 SIGNUP
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// 🔥 LOGIN
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // 🔥 CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 🔥 SEND COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 🔥 RESPONSE
    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// 🔥 LOGOUT
const logoutUser = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({
      message: "Logged out successfully",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


module.exports = {
  signupUser,
  loginUser,
  logoutUser,
};