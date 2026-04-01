import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
function EventDetails() {
    const navigate = useNavigate();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
const [loading, setLoading] = useState(true);
  const [newVolunteer, setNewVolunteer] = useState("");
  const [subEventName, setSubEventName] = useState("");

  useEffect(() => {
    fetchEvent();
  }, []);


const fetchEvent = async () => {
  try {
    const res = await API.get(`/events/${id}/full-data`);

    console.log("DATA:", res.data);

    if (!res.data) {
      throw new Error("No data received");
    }

    const eventData = res.data.event || res.data.data || res.data;

    setEvent(eventData);

  } catch (error) {
    console.log("FETCH ERROR:", error);
  } finally {
    setLoading(false);
  }
};
if (loading) {
  return <h1 className="text-white text-center mt-10">Loading...</h1>;
}
  

  // ✅ Add Volunteer
  const addVolunteer = async () => {
    try {
      await API.post("/events/addVolunteer", {
        eventId: id,
        name: newVolunteer,
      });
      setNewVolunteer("");
      fetchEvent();
    } catch {
      alert("Error adding volunteer");
    }
  };

  // ✅ Create Sub Event
  const createSubEvent = async () => {
    try {
      await API.post("/events/createSubEvent", {
        parentEventId: id,
        eventName: subEventName,
      });
      setSubEventName("");
      fetchEvent();
    } catch {
      alert("Error creating sub event");
    }
  };

  if (!event) return <h1 className="text-white text-center mt-10">Loading...</h1>;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-6">
      
      {/* HEADER */}
      <div className="header">
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold">{event.eventName}</h1>
        <p className="text-gray-400">
          📅 {event.eventDate} | 📍 {event.venue}
        </p>
        
      </div>
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* BUDGET */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Budget</h2>

          <p className="text-gray-300">
            Allocated: ₹{event.budgetCollection?.allocatedBudget || 0}
          </p>
          <p className="text-gray-300">
            Spent: ₹{event.totalSpent || 0}
          </p>
          <p className="text-orange-400 font-bold">
            Remaining: ₹{(event.allocatedBudget || 0) - (event.totalSpent || 0)}
          </p>
        </div>

        {/* VOLUNTEERS */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Volunteers</h2>

          <div className="flex gap-2 mb-4">
            <input
              value={newVolunteer}
              onChange={(e) => setNewVolunteer(e.target.value)}
              placeholder="Add volunteer"
              className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
            />
            <button
              onClick={addVolunteer}
              className="bg-orange-600 px-4 rounded hover:bg-orange-700"
            >
              Add
            </button>
          </div>

          <ul className="space-y-1">
            {event.volunteers?.map((v, i) => (
              <li key={i} className="text-gray-300">• {v.name}</li>
            ))}
          </ul>
        </div>

        {/* EVENT PLAN */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Event Plan</h2>

          {event.eventPlan?.map((plan, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-bold text-orange-400">{plan.heading}</h3>
              <p className="text-gray-300">{plan.body}</p>
            </div>
          ))}
        </div>

        {/* SUB EVENTS 🔥 */}

<div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Sub Events</h2>

    {/* 🔥 NEW BUTTON */}
    <button
      onClick={() => navigate(`/create-event?parentId=${id}`)}
      className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
    >
      + Create
    </button>
  </div>

  <ul className="space-y-2">

    {event.subEvents?.map((sub, i) => (

      <li
        key={i}
        onClick={() => navigate(`/event/${sub._id}`)}   // 🔥 clickable
        className="bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700 transition"
      >
        {sub.eventName}
      </li>

    ))}

  </ul>

</div>
      </div>
    </div>
  );
}

export default EventDetails;