const Event = require("../models/Event");
const BudgetCollection = require("../models/BudgetCollection");

// ➤ Add Expense
const addExpense = async (req, res) => {
  try {

    const { eventId } = req.params;
    const { amount, purpose } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const budgetCollection = await BudgetCollection.findById(event.budgetCollectionId);

    if (!budgetCollection) {
      return res.status(404).json({ message: "Budget collection not found" });
    }

    budgetCollection.transactions.push({
      amount,
      purpose
    });

    await budgetCollection.save();

    res.json({
      message: "Expense added successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ➤ Get Budget Summary
const getBudgetSummary = async (req, res) => {
  try {

    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const budgetCollection = await BudgetCollection.findById(event.budgetCollectionId);

    if (!budgetCollection) {
      return res.status(404).json({ message: "Budget collection not found" });
    }

    const totalSpent = budgetCollection.transactions.reduce((sum, t) => {
      return sum + t.amount;
    }, 0);

    const remainingBudget = event.allocatedBudget - totalSpent;

    res.json({
      allocatedBudget: event.allocatedBudget,
      totalSpent,
      remainingBudget,
      transactions: budgetCollection.transactions
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteExpense = async (req, res) => {
  try {

    const { eventId, transactionId } = req.params;

    // 1. Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. Find budget collection
    const budgetCollection = await BudgetCollection.findById(event.budgetCollectionId);

    if (!budgetCollection) {
      return res.status(404).json({ message: "Budget collection not found" });
    }

    // 3. Remove transaction
    const transaction = budgetCollection.transactions.id(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.deleteOne();  // remove from array

    await budgetCollection.save();

    res.json({
      message: "Expense deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  addExpense,
  getBudgetSummary,
  deleteExpense
};