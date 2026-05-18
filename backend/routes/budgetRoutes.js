const express = require("express");
const router = express.Router();

const {
  addExpense,
  getBudgetSummary,
  deleteExpense,
} = require("../controllers/budgetController");

// 🔥 IMPORT AUTH MIDDLEWARE
const authMiddleware = require("../middleware/authMiddleware");

// 🔥 PROTECTED ROUTES

router.post("/:eventId/add-expense", authMiddleware, addExpense);

router.get("/:eventId/budget-summary", authMiddleware, getBudgetSummary);

router.delete(
  "/:eventId/expense/:transactionId",
  authMiddleware,
  deleteExpense,
);

module.exports = router;
