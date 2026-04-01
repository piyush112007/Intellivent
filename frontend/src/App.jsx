import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<h1>Route Not Found</h1>} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;