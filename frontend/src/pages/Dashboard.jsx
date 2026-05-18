import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";
import Loader from "../components/Loader";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventCode, setEventCode] = useState("");
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(stored).user;

    setUser(parsedUser);

    if (parsedUser?._id) {
      fetchEvents(parsedUser._id);
    }
  }, []);

  const fetchEvents = async (userId) => {
    try {
      setLoading(true);

      const res = await API.get(`/events/user/${userId}/events`);

      setEvents(res.data.events);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");

      localStorage.removeItem("user");

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  if (!user && loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            {/* LOGO */}
            <img
              src={logo}
              alt="IntelliVent Logo"
              className="w-10 h-10 object-contain hover:cursor-pointer "
            />

            {/* TEXT */}
            <h1 className="text-3xl font-bold text-orange-600 tracking-wide hover:cursor-pointer ">
              IntelliVent
            </h1>
          </div>
          <p className="text-gray-400 text-sm hover:cursor-pointer ">
            Welcome back, {user.name} 👋
          </p>
        </div>

        <div className="flex gap-3">
          {/* CREATE EVENT */}
          <button
            onClick={() => navigate("/create-event")}
            className="bg-orange-600 px-6 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            + Create Event
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-red-600 hover:border-red-500 transition text-gray-300 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* JOIN EVENT */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md mb-10 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Join Event</h2>

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
            className="bg-orange-600 px-5 py-3 rounded-lg hover:bg-orange-700 transition hover:cursor-pointer "
          >
            Join
          </button>
        </div>
      </div>

      {/* EVENTS SECTION */}

      <div>
        <h2 className="text-xl font-semibold mb-6 hover:cursor-default">
          Your Events
        </h2>

        <p className="text-gray-400 mb-5 hover:cursor-default">
          {loading
            ? "Fetching your events..."
            : `Total Events: ${events.length}`}
        </p>

        {/* 🔥 SKELETON LOADER */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-gray-900 p-5 rounded-2xl border border-gray-800 animate-pulse"
              >
                {/* TITLE */}
                <div className="h-5 w-40 bg-gray-700 rounded mb-4"></div>

                {/* DATE */}
                <div className="h-4 w-28 bg-gray-800 rounded mb-3"></div>

                {/* VENUE */}
                <div className="h-4 w-32 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
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
                <h3 className="text-lg font-bold mb-2">{event.eventName}</h3>

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
