import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import API from "../services/api";

function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [image, setImage] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null); // 🔥 modal control

  useEffect(() => {
    fetchEvent();
  }, [id]);

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
  const handleDeleteEvent = async () => {
    try {
      await API.delete(`/events/${id}`);

      alert("Event deleted successfully");

      navigate("/dashboard"); // 🔥 redirect after delete
    } catch (err) {
      console.log(err);
      alert("Failed to delete event");
    }
  };
  // 🔥 CALCULATIONS
  const totalSpent = event?.budget?.reduce((sum, b) => sum + b.amount, 0) || 0;

  const remaining = (event?.allocatedBudget || 0) - totalSpent;

  // 🔥 COPY
  const copyEventId = () => {
    navigator.clipboard.writeText(event._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 🔥 IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!image) return;

    try {
      await API.post(`/events/${id}/image`, { image });
      setImage("");
      fetchEvent();
    } catch {
      alert("Upload failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/events/${id}/image/${deleteIndex}`);
      setDeleteIndex(null);
      fetchEvent();
    } catch {
      alert("Delete failed");
    }
  };
  // 🔥 DROPZONE
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  if (loading)
    return <h1 className="text-white text-center mt-10">Loading...</h1>;

  if (!event)
    return <h1 className="text-white text-center mt-10">No Event Found</h1>;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold">{event.eventName}</h1>
          <p className="text-gray-400">
            📅 {event.eventDate} | 📍 {event.venue}
          </p>

          {/* COPY ID */}
          <div className="flex items-center gap-3 mt-2">
            <p className="text-gray-500 text-sm">ID: {event._id}</p>

            <button
              onClick={copyEventId}
              className={`p-2 rounded transition ${
                copied
                  ? "bg-orange-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-orange-500"
              }`}
            >
              {copied ? "✓" : "📋"}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 ml-3"
            >
              Delete Event
            </button>
          </div>
        </div>

        <div className="dashboardsnavigation">
          <button
            onClick={() => navigate(`/event/${id}/ai`)}
            className="bg-purple-600 px-4 py-2 rounded m-3 hover:bg-purple-700"
          >
            AI Dashboard
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-700"
          >
            Dashboard
          </button>
        </div>
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

          <button
            onClick={() => navigate(`/event/${id}/volunteers`)}
            className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-700"
          >
            Manage Volunteers
          </button>
        </div>

        {/* EVENT PLAN */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Event Plan</h2>

            <button
              onClick={() => navigate(`/event/${id}/plan`)}
              className="bg-orange-600 px-4 py-2 rounded"
            >
              Manage Plans
            </button>
          </div>
        </div>

        {/* SUB EVENTS */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Sub Events</h2>

            <button
              onClick={() => navigate(`/create-event?parentId=${id}`)}
              className="bg-orange-600 px-4 py-2 rounded"
            >
              + Create
            </button>
          </div>

          {event.subEvents?.map((sub, i) => (
            <div
              key={i}
              onClick={() => navigate(`/event/${sub._id}`)}
              className="bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700"
            >
              {sub.eventName}
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 IMAGE SECTION */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mt-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Event Images</h2>
          <span className="text-gray-400">{event.images?.length || 0}/2</span>
        </div>

        {/* UPLOAD */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          {/* 🔥 DROP ZONE */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
      ${
        isDragActive
          ? "border-orange-500 bg-orange-500/10"
          : "border-gray-600 hover:border-orange-500"
      }`}
          >
            <input {...getInputProps()} />

            {isDragActive ? (
              <p className="text-orange-400">Drop image here...</p>
            ) : (
              <p className="text-gray-400">
                Drag & drop image here or{" "}
                <span className="text-orange-500 font-semibold">
                  click to upload
                </span>
              </p>
            )}
          </div>

          {/* 🔥 BUTTON RIGHT SIDE */}
          <div className="flex justify-end mt-4">
            <button
              onClick={uploadImage}
              disabled={!image || event.images?.length >= 2}
              className="bg-orange-600 px-5 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              Upload
            </button>
          </div>
        </div>
        {/* PREVIEW */}
        {image && (
          <img
            src={image}
            className="w-40 mt-4 rounded border border-gray-700"
          />
        )}

        {/* GALLERY */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {event.images?.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden">
              <img src={img} className="w-full h-40 object-cover" />

              {/* DELETE BUTTON */}
              <button
                onClick={() => setDeleteIndex(i)}
                className="absolute top-2 right-2 bg-orange-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 BIG MODAL */}
      {deleteIndex !== null && (
  <div style={{ animation: "fadeIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);" }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50  ">

    {/* MODAL CARD */}
    <div  className="bg-gray-900/90 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl w-[380px] p-8 text-center ">

      {/* 🔥 ICON WITH BACKGROUND */}
      <div className="flex justify-center mb-6">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30">

          {/* GLOW */}
          <div className="absolute inset-0 rounded-full bg-orange-500 opacity-20 blur-xl"></div>

          {/* TRASH ICON */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-orange-500 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7L5 7M10 11v6M14 11v6M9 7V4h6v3m-9 0h12l-1 12H7L6 7z"
            />
          </svg>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-white mb-2">
        Delete Image
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        This image will be permanently removed from your event gallery.
        <br />
        <span className="text-orange-400 font-medium">
          This action cannot be undone.
        </span>
      </p>

      {/* BUTTONS */}
      <div className="flex gap-4 justify-center">

        {/* CANCEL */}
        <button
          onClick={() => setDeleteIndex(null)}
          className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300 border border-gray-700"
        >
          Cancel
        </button>

        {/* DELETE */}
        <button
          onClick={confirmDelete}
          className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 transition text-white shadow-md hover:shadow-orange-500/30"
        >
          Delete
        </button>

      </div>
    </div>
  </div>
)}  
    {showDeleteModal && (
        <div style={{ animation: "fadeIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);" }}   className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50  ">
          {/* MODAL CARD */}
          <div className="bg-gray-900/90 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl w-[380px] p-8 text-center animate-fadeIn">
            {/* ICON */}
            <div className="flex justify-center mb-6">
  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30">

    {/* 🔥 GLOW EFFECT */}
    <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 blur-xl"></div>

    {/* 🔥 ICON */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10 text-red-500 relative z-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01M10.29 3.86l-7.1 12.28A2 2 0 004.9 19h14.2a2 2 0 001.71-2.86l-7.1-12.28a2 2 0 00-3.42 0z"
      />
    </svg>
  </div>
</div>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-white mb-2">Delete Event</h2>

            {/* SUBTEXT */}
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              This will permanently delete your event and all associated data.
              <br />
              <span className="text-red-400 font-medium">
                This action cannot be undone.
              </span>
            </p>

            {/* BUTTONS */}
            <div className="flex gap-4 justify-center">
              {/* CANCEL */}
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300 border border-gray-700"
              >
                Cancel
              </button>

              {/* DELETE */}
              <button
                onClick={handleDeleteEvent}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white shadow-md hover:shadow-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
