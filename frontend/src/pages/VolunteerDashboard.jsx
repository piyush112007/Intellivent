import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function VolunteerDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("add"); // 🔥 toggle

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  const [filterRole, setFilterRole] = useState("");
  const [filterDept, setFilterDept] = useState("");

  useEffect(() => {
    fetchEvent();
  }, []);
useEffect(() => {
  if (activeTab === "add") {
    setFilterRole("");
    setFilterDept("");
  }
}, [activeTab]);
  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}/full-data`);
      setEvent(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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

  const deleteVolunteer = async (index) => {
    try {
      await API.delete(`/events/${id}/volunteer/${index}`);
      fetchEvent();
    } catch {
      alert("Error deleting volunteer");
    }
  };

  if (loading)
    return <h1 className="text-white text-center mt-10">Loading...</h1>;

  // 🔥 UNIQUE FILTER VALUES
  const roles = [...new Set(event.volunteers.map(v => v.role))];
  const departments = [...new Set(event.volunteers.map(v => v.department))];

  // 🔥 FILTER LOGIC
  const filteredVolunteers = event.volunteers.filter(v => {
    return (
      (!filterRole || v.role === filterRole) &&
      (!filterDept || v.department === filterDept)
    );
  });

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

      {/* 🔥 TOGGLE BUTTONS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 rounded ${
            activeTab === "add"
              ? "bg-orange-600"
              : "bg-gray-700"
          }`}
        >
          Add Volunteer
        </button>

        <button
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-2 rounded ${
            activeTab === "manage"
              ? "bg-orange-600"
              : "bg-gray-700"
          }`}
        >
          Manage Volunteers
        </button>
      </div>

      {/* 🔥 ADD TAB */}
      {activeTab === "add" && (
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

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

          <button
            onClick={addVolunteer}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Add Volunteer
          </button>
        </div>
      )}

      {/* 🔥 MANAGE TAB */}
      {activeTab === "manage" && (
        <div>

          {/* 🔥 FILTERS */}
          <div className="flex gap-6 mb-6">

            {/* ROLE FILTER */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-gray-800 p-2 rounded border border-gray-700 w-fit"
            >
              <option value="">All Roles</option>
              {roles.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>

            {/* DEPARTMENT FILTER */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-gray-800 p-2 rounded border border-gray-700 w-fit"
            >
              <option value="">All Departments</option>
              {departments.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>

          </div>

          {/* 🔥 VOLUNTEER LIST */}
          

        </div>
      )}
      {/* 🔥 LIST ALWAYS SHOWN */}
<div className="mt-6">

  

  {/* 🔥 VOLUNTEER LIST */}
  <div className="space-y-3">
    {filteredVolunteers.map((v, i) => (
      <div
        key={i}
        className="bg-gray-800 p-4 rounded flex justify-between items-center hover:bg-gray-700 transition"
      >
        <div>
          <p className="font-semibold text-lg">{v.name}</p>
          <p className="text-sm text-gray-400">
            {v.role} • {v.department}
          </p>
        </div>

        {activeTab === "manage" && (
  <button
    onClick={() => deleteVolunteer(i)}
    className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
  >
    Delete
  </button>
)}
      </div>
    ))}
  </div>

</div>

    </div>
    
  );
}

export default VolunteerDashboard;