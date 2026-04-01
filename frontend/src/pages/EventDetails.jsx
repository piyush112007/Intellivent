import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newVolunteer, setNewVolunteer] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]); // 🔥 FIXED

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/events/${id}/full-data`);
      const eventData = res.data.data || res.data;
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

  if (!event) {
    return <h1 className="text-white text-center mt-10">No Event Found</h1>;
  }

  // 🔥 CALCULATE SPENT
  const totalSpent = event.budget?.reduce((sum, b) => sum + b.amount, 0) || 0;
  const remaining = (event.allocatedBudget || 0) - totalSpent;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold">{event.eventName}</h1>
          <p className="text-gray-400">
            📅 {event.eventDate} | 📍 {event.venue}
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-700"
        >
          Dashboard
        </button>
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* BUDGET */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Budget</h2>
          <div className="flex items-center justify-between \">
            <div className="budgetdetails ">
              <p className="text-gray-300">
                Allocated: ₹{event.allocatedBudget || 0}
              </p>

              <p className="text-gray-300">Spent: ₹{totalSpent}</p>

              <p
                className={`font-bold ${
                  remaining > 0
                    ? "text-green-400"
                    : remaining < 0
                      ? "text-red-400"
                      : "text-yellow-400"
                }`}
              >
                Remaining: ₹{remaining}
              </p>
            </div>
            {/* 🔥 Manage Budget */}
            <div className="button">
              <button
                onClick={() => navigate(`/event/${id}/budget`)}
                className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 mt-4 "
              >
                Manage Budget
              </button>
            </div>
          </div>
        </div>

        {/* VOLUNTEERS */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Volunteers</h2>

          {/* 🔥 Manage Volunteers */}
          <button
            onClick={() => navigate(`/event/${id}/volunteers`)}
            className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-700"
          >
            Manage Volunteers
          </button>
        </div>

        {/* EVENT PLAN */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="headofeventplan flex items-center  justify-between ">
            <h2 className="text-xl font-semibold mb-4 items-center">
              Event Plan
            </h2>
            <button
              onClick={() => navigate(`/event/${id}/plan`)}
              className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 "
            >
              Manage Plans
            </button>
          </div>

          {event.eventPlan?.length === 0 ? (
            <p className="text-gray-400 mt-5">No plan added</p>
          ) : (
            event.eventPlan.map((plan, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-bold text-orange-400">{plan.heading}</h3>
                <p className="text-gray-300">{plan.body}</p>
              </div>
            ))
          )}
        </div>

        {/* SUB EVENTS */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sub Events</h2>

            <button
              onClick={() => navigate(`/create-event?parentId=${id}`)}
              className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-700"
            >
              + Create
            </button>
          </div>

          {event.subEvents?.length === 0 ? (
            <p className="text-gray-400">No sub-events</p>
          ) : (
            <ul className="space-y-2">
              {event.subEvents.map((sub, i) => (
                <li
                  key={i}
                  onClick={() => navigate(`/event/${sub._id}`)}
                  className="bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700 transition"
                >
                  {sub.eventName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
