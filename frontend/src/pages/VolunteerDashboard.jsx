import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function VolunteerDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchEvent();
  }, []);

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

  // ✅ Add single volunteer
  const addVolunteer = async () => {
    try {
      await API.post(`/events/${id}/volunteer`, {
  name,
  role,
  department,
});

      setName("");
      setRole("");
      setDepartment("");
      fetchEvent();
    } catch {
      alert("Error adding volunteer");
    }
  };

  // ✅ Add multiple volunteers
  const addMultiple = async () => {
    try {
      await API.post(`/events/${id}/volunteers`, {
  volunteers: [
    { name: "John", role: "Coordinator", department: "Tech" },
    { name: "Alice", role: "Support", department: "Management" },
  ],
});


      fetchEvent();
    } catch {
      alert("Error adding multiple volunteers");
    }
  };

  if (loading) {
    return <h1 className="text-white text-center mt-10">Loading...</h1>;
  }
const deleteVolunteer = async (index) => {
  try {
    await API.delete(`/events/${id}/volunteer/${index}`);
    fetchEvent();
  } catch {
    alert("Error deleting volunteer");
  }
};
  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>

        <button
          onClick={() => navigate(`/event/${id}`)}
          className="bg-orange-600 px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>

      {/* ADD FORM */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Volunteer</h2>

        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded"
          />

          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded"
          />

          <input
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={addVolunteer}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Add Volunteer
          </button>

          <button
            onClick={addMultiple}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Sample Multiple
          </button>
        </div>
      </div>

      {/* VOLUNTEER LIST */}
      <div className="space-y-3">
  {event.volunteers.map((v, i) => (
    <div
      key={i}
      className="bg-gray-800 p-3 rounded flex justify-between items-center"
    >
      <div>
        <p className="font-semibold">{v.name}</p>
        <p className="text-sm text-gray-400">
          {v.role} • {v.department}
        </p>
      </div>

      {/* 🔥 DELETE BUTTON */}
      <button
        onClick={() => deleteVolunteer(i)}
        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  ))}
</div>
    </div>
  );
}

export default VolunteerDashboard;