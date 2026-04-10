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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 w-[350px] text-center">
            <h2 className="text-xl font-semibold mb-4">Delete Image?</h2>

            <p className="text-gray-400 mb-6">This action cannot be undone.</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteIndex(null)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-700"
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
