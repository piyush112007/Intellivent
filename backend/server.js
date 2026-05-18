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
const allowedOrigins = [
  "http://localhost:5173",
  "https://intellivent.vercel.app",
  "https://intelliventfrontend-git-features-piyush112007s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (postman/mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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
