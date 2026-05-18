require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// 🔥 MIDDLEWARES
app.use(express.json());

app.use(cookieParser());

// 🔥 CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://intellivent.vercel.app",
      "https://intelliventfrontend-git-features-piyush112007s-projects.vercel.app",
    ],
    credentials: true,
  }),
);
app.options("*", cors());

// 🔥 DATABASE
connectDB();

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("IntelliVent API running");
});

// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/ai", aiRoutes);

// 🔥 EXPORT FOR VERCEL
module.exports = app;
