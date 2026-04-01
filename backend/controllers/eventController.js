const Event = require("../models/Event");
const User = require("../models/user");
const BudgetCollection = require("../models/BudgetCollection");

const createEvent = async (req, res) => {
  try {
    const { eventName, eventDate, venue, description, allocatedBudget, userId } = req.body;

    const event = await Event.create({
      eventName,
      eventDate,
      venue,
      description,
      allocatedBudget: Number(allocatedBudget),
      createdBy: userId,
      subEvents: [],
    });

    const budgetCollection = await BudgetCollection.create({
      eventId: event._id,
      allocatedBudget: Number(allocatedBudget), // 🔥 IMPORTANT
      expenses: [],
    });

    event.budgetCollectionId = budgetCollection._id;
    await event.save();

    const user = await User.findById(userId);
    if (user) {
      user.events.push(event._id);
      await user.save();
    }

    res.json({ event });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createSubEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const {
      eventName,
      eventDate,
      venue,
      description,
      allocatedBudget,
      userId,
    } = req.body;

    // 1️⃣ Find parent
    const parentEvent = await Event.findById(eventId);

    if (!parentEvent) {
      return res.status(404).json({ error: "Parent event not found" });
    }

    // 2️⃣ Create sub-event
    const newEvent = await Event.create({
      eventName,
      eventDate,
      venue,
      description,
      allocatedBudget: Number(allocatedBudget),
      createdBy: userId,
      subEvents: [],
    });

    // 3️⃣ Create its own budget collection
    const newBudget = await BudgetCollection.create({
      eventId: newEvent._id,
      allocatedBudget: Number(allocatedBudget),
      expenses: [],
    });

    // 4️⃣ Link budget to sub-event
    newEvent.budgetCollectionId = newBudget._id;
    await newEvent.save();

    // 5️⃣ Link sub-event to parent
    parentEvent.subEvents.push(newEvent._id);
    await parentEvent.save();

    res.status(201).json({
      message: "Sub event created successfully",
      event: newEvent,
    });

  } catch (error) {
    console.log("CREATE SUB EVENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
const addSubEvent = async (req, res) => {
  try {
    const { eventId } = req.params;        // parent
    const { subEventId } = req.body;       // existing event

    // 1️⃣ Validate IDs
    if (!subEventId) {
      return res.status(400).json({ error: "Sub event ID required" });
    }

    if (eventId === subEventId) {
      return res.status(400).json({ error: "Cannot add event to itself" });
    }

    // 2️⃣ Find parent + sub event
    const parentEvent = await Event.findById(eventId);
    const subEvent = await Event.findById(subEventId);

    if (!parentEvent) {
      return res.status(404).json({ error: "Parent event not found" });
    }

    if (!subEvent) {
      return res.status(404).json({ error: "Sub event not found" });
    }

    // 3️⃣ Prevent duplicates
    if (parentEvent.subEvents.includes(subEventId)) {
      return res.status(400).json({ error: "Sub-event already added" });
    }

    // 4️⃣ Prevent circular nesting (important 🔥)
    if (subEvent.subEvents.includes(eventId)) {
      return res.status(400).json({ error: "Circular reference not allowed" });
    }

    // 5️⃣ Add sub-event
    parentEvent.subEvents.push(subEventId);
    await parentEvent.save();

    res.json({
      message: "Sub-event linked successfully",
      parentEvent,
    });

  } catch (error) {
    console.log("ADD SUB EVENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
const addVolunteer = async (req, res) => {
  try {

    const { eventId } = req.params;
    const { name, role, department } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.volunteers.push({
      name,
      role,
      department
    });

    await event.save();

    res.json({
      message: "Volunteer added successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addMultipleVolunteers = async (req, res) => {
  try {

    const { eventId } = req.params;
    const { volunteers } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.volunteers.push(...volunteers);

    await event.save();

    res.json({
      message: "Volunteers added successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addBudget = async (req, res) => {
  try {

    const { eventId } = req.params;
    const { item, amount } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.budget.push({
      item,
      amount
    });

    await event.save();

    res.json({
      message: "Budget item added successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addMultipleBudget = async (req, res) => {
  try {

    const { eventId } = req.params;
    const { budget } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.budget.push(...budget);

    await event.save();

    res.json({
      message: "Budget items added successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addEventPlan = async (req, res) => {
  try {

    const { eventId } = req.params;
    const { heading, body } = req.body;

    const event = await Event.findById(eventId);
    const headingRegex = /^[a-zA-Z0-9_-]+$/;

if (!headingRegex.test(heading)) {
  return res.status(400).json({
    message: "Heading can only contain letters, numbers, underscore, or hyphen"
  });
}
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.eventPlan.push({
      heading,
      body
    });

    await event.save();

    res.json({
      message: "Event plan added successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addMultipleEventPlans = async (req, res) => {
  try {

    const { eventId } = req.params;
    const { plans } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.eventPlan.push(...plans);

    await event.save();

    res.json({
      message: "Event plans added successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateEventPlanByHeading = async (req, res) => {
  try {

    const { eventId, heading } = req.params;
    const { body } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const plan = event.eventPlan.find(p => p.heading === heading);

    if (!plan) {
      return res.status(404).json({ message: "Heading not found" });
    }

    plan.body = body;

    await event.save();

    res.json({
      message: "Event plan updated successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getEventWithSubEvents = async (eventId) => {

  const event = await Event.findById(eventId)
  .populate("budgetCollectionId")
  .lean();

  if (!event) return null;

  // Recursively fetch sub-events
  if (event.subEvents && event.subEvents.length > 0) {

    const populatedSubEvents = [];

    for (let subEventId of event.subEvents) {

      const subEventData = await getEventWithSubEvents(subEventId);

      if (subEventData) {
        populatedSubEvents.push(subEventData);
      }
    }

    event.subEvents = populatedSubEvents;
  }

  return event;
};
const getEventFullData = async (req, res) => {
  try {

    const { eventId } = req.params;

    const event = await getEventWithSubEvents(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json({
      message: "Full nested event data fetched successfully",
      data: event
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
const getEventSummary = async (req, res) => {
  try {

    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const totalVolunteers = event.volunteers.length;

    const totalBudget = event.budget.reduce((sum, item) => {
      return sum + item.amount;
    }, 0);

    const totalSections = event.eventPlan.length;

    res.json({
      message: "Event summary fetched successfully",
      summary: {
        totalVolunteers,
        totalBudget,
        totalSections
      }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
  
};
const getUserEvents = async (req, res) => {
  try {

    const { userId } = req.params;

    const user = await User.findById(userId).populate("events");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      events: user.events
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const shareEventAccess = async (req, res) => {
  try {

    const { userId, eventId } = req.body;

    // 1. Check event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // 2. Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 3. Check if already added
    if (user.events.includes(eventId)) {
      return res.status(400).json({
        message: "User already has access to this event"
      });
    }

    // 4. Add event to user
    user.events.push(eventId);

    await user.save();

    res.json({
      message: "Event shared successfully",
      eventId
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
const updateEvent = async (req, res) => {
  try {

    const { eventId } = req.params;
    const updates = req.body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      updates,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteEvent = async (req, res) => {
  try {

    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 1. Delete budget collection
    if (event.budgetCollectionId) {
      await BudgetCollection.findByIdAndDelete(event.budgetCollectionId);
    }

    // 2. Remove event from all users
    await User.updateMany(
      { events: eventId },
      { $pull: { events: eventId } }
    );

    // 3. Delete event
    await Event.findByIdAndDelete(eventId);

    res.json({
      message: "Event deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createEvent,
  addVolunteer,
  addMultipleVolunteers,
  addBudget,
  addMultipleBudget,
  addEventPlan,
  addMultipleEventPlans,
  updateEventPlanByHeading,
  getEventFullData,
  getEventSummary,
  createSubEvent,
  addSubEvent,
  getUserEvents,
  shareEventAccess,
  updateEvent,
  deleteEvent
};