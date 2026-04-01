const mongoose = require("mongoose");

const budgetCollectionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  allocatedBudget: {
    type: Number,
    default: 0,
  },
  expenses: [
    {
      amount: Number,
      description: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("BudgetCollection", budgetCollectionSchema);