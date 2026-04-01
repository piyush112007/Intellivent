const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: String,
  role: String,
  department: String
});

const budgetSchema = new mongoose.Schema({
  item: String,
  amount: Number
});

const eventPlanSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9_-]+$/
  },

  body: {
    type: String,
    required: true
  }
});

const eventSchema = new mongoose.Schema({

  eventName: {
    type: String,
    required: true
  },

  eventDate: String,

  venue: String,

  description: String,
allocatedBudget: {
  type: Number,
  default: 0
},

budgetCollectionId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "BudgetCollection"
},
  volunteers: [volunteerSchema],

  budget: [budgetSchema],

  eventPlan: [eventPlanSchema],

  createdAt: {
    type: Date,
    default: Date.now
  },
  subEvents: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  }
],


});

module.exports = mongoose.model("Event", eventSchema);