const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const budgetCollectionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },

  transactions: [transactionSchema]

}, { timestamps: true });

module.exports = mongoose.model("BudgetCollection", budgetCollectionSchema);