import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EventPlanDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("add");

  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");

  const [editHeading, setEditHeading] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]); // 🔥 important fix

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}/full-data`);
      const data = res.data.data || res.data;
      setEvent(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD PLAN
  const addPlan = async () => {
    try {
      await API.post(`/events/${id}/event-plan`, {
        heading,
        body,
      });

      setHeading("");
      setBody("");
      fetchEvent();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding plan");
    }
  };

  // ✅ UPDATE PLAN
  const updatePlan = async () => {
    try {
      await API.put(`/events/${id}/event-plan/${editHeading}`, {
        body: editBody,
      });

      setEditHeading("");
      setEditBody("");
      fetchEvent();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating plan");
    }
  };

  if (loading) {
    return <h1 className="text-white text-center mt-10">Loading...</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Event Plan Dashboard</h1>

        <button
          onClick={() => navigate(`/event/${id}`)}
          className="bg-orange-600 px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>

      {/* 🔥 TOGGLE */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode("add")}
          className={`px-4 py-2 rounded hover:cursor-pointer ${
            mode === "add" ? "bg-orange-600" : "bg-gray-700"
          }`}
        >
          Add Plan
        </button>

        <button
          onClick={() => setMode("edit")}
          className={`px-4 py-2 rounded hover:cursor-pointer ${
            mode === "edit" ? "bg-orange-600" : "bg-gray-700"
          }`}
        >
          Edit Plan
        </button>
      </div>

      {/* ADD MODE */}
      {mode === "add" && (
        <div className="bg-gray-900 p-6 rounded-2xl mb-6">
          <h2 className="mb-4 font-semibold">Add Plan</h2>

          <input
            placeholder="Heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-800 rounded"
          />

          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-800 rounded"
          />

          <button
            onClick={addPlan}
            className="bg-orange-600 px-4 py-2 rounded hover:cursor-pointer hover:bg-orange-700"
          >
            Add Plan
          </button>
        </div>
      )}

      {/* EDIT MODE */}
      {mode === "edit" && (
        <div className="bg-gray-900 p-6 rounded-2xl mb-6">
          <h2 className="mb-4 font-semibold">Edit Plan</h2>

          <input
            placeholder="Heading to Edit"
            value={editHeading}
            onChange={(e) => setEditHeading(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-800 rounded"
          />

          <textarea
            placeholder="New Body"
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-800 rounded"
          />

          <button
            onClick={updatePlan}
            className="bg-orange-600 px-4 py-2 rounded hover:cursor-pointer hover:bg-orange-700"
          >
            Update Plan
          </button>
        </div>
      )}

      {/* PLAN LIST */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold mb-2">All Plans</h2>

        {event.eventPlan?.length === 0 ? (
          <p className="text-gray-400">No plans added</p>
        ) : (
          event.eventPlan.map((plan, i) => (
            <div
              key={i}
              className="bg-gray-800 p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-orange-400">
                  {plan.heading}
                </p>
                <p className="text-sm text-gray-300">{plan.body}</p>
              </div>

              <button
                onClick={() => {
                  setMode("edit");
                  setEditHeading(plan.heading);
                  setEditBody(plan.body);
                }}
                className="bg-orange-600 px-3 py-1 rounded hover:cursor-pointer hover:bg-orange-700"
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default EventPlanDashboard;