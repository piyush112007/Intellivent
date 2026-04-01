const express = require("express");
const router = express.Router();

const { createEvent, addVolunteer, addMultipleVolunteers,addBudget,addMultipleBudget,addEventPlan,addMultipleEventPlans,updateEventPlanByHeading,getEventFullData,getEventSummary,createSubEvent,addSubEvent,getUserEvents,shareEventAccess, updateEvent, deleteEvent,deleteVolunteer  } = require("../controllers/eventController");

router.post("/create", createEvent);
router.post("/:eventId/volunteers", addMultipleVolunteers);
router.post("/:eventId/volunteer", addVolunteer);
router.post("/:eventId/budget", addBudget);
router.post("/:eventId/budgets", addMultipleBudget);
router.post("/:eventId/event-plan", addEventPlan);
router.post("/:eventId/event-plans", addMultipleEventPlans);
router.put("/:eventId/event-plan/:heading", updateEventPlanByHeading);
router.get("/:eventId/full-data", getEventFullData);
router.get("/:eventId/summary", getEventSummary);
router.post("/:eventId/sub-event", addSubEvent);
router.post("/:eventId/create-sub-event", createSubEvent);
router.get("/user/:userId/events", getUserEvents);
router.post("/share-event", shareEventAccess);
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);
router.delete("/:eventId/volunteer/:index", deleteVolunteer);

module.exports = router;