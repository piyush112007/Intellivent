const express = require("express");
const router = express.Router();

const {
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
  deleteEvent,
  deleteVolunteer,
  addImage,
  deleteImage,
} = require("../controllers/eventController");

// 🔥 IMPORT MIDDLEWARE
const authMiddleware = require("../middleware/authMiddleware");

// 🔥 PROTECTED ROUTES

router.post("/create", authMiddleware, createEvent);

router.post("/:eventId/volunteers", authMiddleware, addMultipleVolunteers);

router.post("/:eventId/volunteer", authMiddleware, addVolunteer);

router.post("/:eventId/budget", authMiddleware, addBudget);

router.post("/:eventId/budgets", authMiddleware, addMultipleBudget);

router.post("/:eventId/event-plan", authMiddleware, addEventPlan);

router.post("/:eventId/event-plans", authMiddleware, addMultipleEventPlans);

router.put(
  "/:eventId/event-plan/:heading",
  authMiddleware,
  updateEventPlanByHeading,
);

router.get("/:eventId/full-data", authMiddleware, getEventFullData);

router.get("/:eventId/summary", authMiddleware, getEventSummary);

router.post("/:eventId/sub-event", authMiddleware, addSubEvent);

router.post("/:eventId/create-sub-event", authMiddleware, createSubEvent);

router.get("/user/:userId/events", authMiddleware, getUserEvents);

router.post("/share-event", authMiddleware, shareEventAccess);

router.put("/:eventId", authMiddleware, updateEvent);

router.delete("/:eventId", authMiddleware, deleteEvent);

router.delete("/:eventId/volunteer/:index", authMiddleware, deleteVolunteer);

router.post("/:eventId/image", authMiddleware, addImage);

router.delete("/:eventId/image/:index", authMiddleware, deleteImage);

module.exports = router;
