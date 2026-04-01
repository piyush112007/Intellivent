const express = require("express");
const router = express.Router();

const { addExpense, getBudgetSummary, deleteExpense } = require("../controllers/budgetController");

router.post("/:eventId/add-expense", addExpense);

router.get("/:eventId/budget-summary", getBudgetSummary);
router.delete("/:eventId/expense/:transactionId", deleteExpense);

module.exports = router;