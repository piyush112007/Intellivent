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
      <div className="flex items-start justify-between mb-8 border-b border-gray-800 pb-4">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="IntelliVent Logo"
              className="w-10 h-10 object-contain"
            />

            <h1 className="text-3xl font-bold text-orange-600 tracking-wide">
              IntelliVent
            </h1>
          </div>

          <p className="text-gray-400 text-sm mt-2">
            Welcome back, {user.name} 👋
          </p>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex gap-2">
          {/* CREATE */}
          <button
            onClick={() => navigate("/create-event")}
            className="
        w-12 h-12
        rounded-xl
        bg-orange-600
        hover:bg-orange-700
        transition
        flex items-center justify-center
        text-white
        text-4xl
        leading-none
        pb-1
        flex-shrink-0
      "
          >
            +
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
        w-12 h-12
        rounded-xl
        bg-gray-800
        border border-gray-700
        hover:bg-red-600
        hover:border-red-500
        transition
        flex items-center justify-center
        text-gray-300 hover:text-white
        flex-shrink-0
      "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3h9m0 0l-3-3m3 3l-3 3"
              />
            </svg>
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
        className="bg-gray-900 p-5 rounded-2xl border border-gray-800"
      >

        {/* TITLE */}
        <div className="h-6 w-36 bg-gray-800/80 rounded-lg mb-5 animate-pulse [animation-duration:2s]"></div>

        {/* DATE */}
        <div className="flex items-center gap-2 mb-3">

          <div className="w-4 h-4 bg-gray-800/80 rounded animate-pulse [animation-duration:2s]"></div>

          <div className="h-4 w-28 bg-gray-800/80 rounded animate-pulse [animation-duration:2s]"></div>

        </div>

        {/* VENUE */}
        <div className="flex items-center gap-2">

          <div className="w-4 h-4 bg-gray-800/80 rounded animate-pulse [animation-duration:2s]"></div>

          <div className="h-4 w-32 bg-gray-800/80 rounded animate-pulse [animation-duration:2s]"></div>

        </div>

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
