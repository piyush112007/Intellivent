import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored).user : null;

  const [events, setEvents] = useState([]);
  const [eventCode, setEventCode] = useState("");

  useEffect(() => {
    if (user?._id) fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const res = await API.get(`/events/user/${user._id}/events`);
      setEvents(res.data.events);
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinEvent = async () => {
    try {
      await API.post("/events/share-event", {
        userId: user._id,
        eventId: eventCode,
      });

      alert("Joined event ✅");
      fetchEvents();
      setEventCode("");
    } catch {
      alert("Invalid Event ID");
    }
  };

  if (!user) return <h1 className="text-center text-white mt-10">Login first</h1>;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-gray-800 pb-4">
        
        <div>
          <h1 className="text-3xl font-bold text-orange-600">
            IntelliVent
          </h1>
          <p className="text-gray-400 text-sm">
            Welcome back, {user.name} 👋
          </p>
        </div>

        <button
          onClick={() => navigate("/create-event")}
          className="bg-orange-600 px-6 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          + Create Event
        </button>

      </div>

      {/* JOIN EVENT */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md mb-10 border border-gray-800">
        
        <h2 className="text-lg font-semibold mb-4">
          Join Event
        </h2>

        <div className="flex flex-col md:flex-row gap-3">
          
          <input
            type="text"
            placeholder="Enter Event ID"
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleJoinEvent}
            className="bg-purple-600 px-5 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Join
          </button>

        </div>

      </div>

      {/* EVENTS SECTION */}
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Your Events
        </h2>

        {events.length === 0 ? (
          <div className="bg-gray-900 p-8 rounded-xl text-center text-gray-400 border border-gray-800">
            No events yet 🚀
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {events.map((event) => (
              <div
                key={event._id}
                onClick={() => navigate(`/event/${event._id}`)}
                className="bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-blue-500 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="text-lg font-bold mb-2">
                  {event.eventName}
                </h3>

                <p className="text-sm text-gray-400">
                  📅 {event.eventDate || "No date"}
                </p>

                <p className="text-sm text-gray-400">
                  📍 {event.venue || "No venue"}
                </p>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard; 