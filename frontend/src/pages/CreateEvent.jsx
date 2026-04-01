import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

function CreateEvent() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const parentId = searchParams.get("parentId");

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [allocatedBudget, setBudget] = useState("");

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored).user : null;

  const handleCreateEvent = async () => {
    try {
      let res;

      if (parentId) {
        // 🔥 CORRECT SUB EVENT ROUTE
        console.log("PARENT ID:", parentId);
        res = await API.post(`/events/${parentId}/create-sub-event`, {
          eventName,
          eventDate,
          venue,
          description,
          allocatedBudget: Number(allocatedBudget),
          userId: user._id,
        });
      } else {
        // 🔥 NORMAL EVENT
        res = await API.post("/events/create", {
          eventName,
          eventDate,
          venue,
          description,
          allocatedBudget: Number(allocatedBudget),
          userId: user._id,
        });
      }

      alert("Event created successfully 🎉");

      // 🔥 SMART REDIRECT
      if (parentId) {
        navigate(`/event/${parentId}`);
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);
      alert(error.response?.data?.message || "Error creating event");
    }
  };
  console.log("USER ID:", user._id);

  if (!user) {
    return <h1 className="text-white text-center mt-10">Login first</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      
      <div className="w-full max-w-xl bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
        
        <h1 className="text-2xl font-bold mb-6 text-center">
          {parentId ? "Create Sub Event" : "Create New Event"}
        </h1>

        <div className="space-y-4">
          
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
          />

          <input
            type="text"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
          />

          <input
            type="number"
            placeholder="Allocated Budget"
            value={allocatedBudget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
          />

          <button
            onClick={handleCreateEvent}
            className="w-full bg-orange-600 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            {parentId ? "Create Sub Event" : "Create Event"}
          </button>

          <button
            onClick={() =>
              parentId ? navigate(`/event/${parentId}`) : navigate("/dashboard")
            }
            className="w-full border border-gray-700 py-2 rounded-lg hover:bg-gray-800"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateEvent;