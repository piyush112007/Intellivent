import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import VolunteerDashboard from "./pages/VolunteerDashboard"
import BudgetDashboard from "./pages/BudgetDashboard"
import EventPlanDashboard from "./pages/EventPlanDashboard"
import AIDashboard from "./pages/AIDashboard"
useEffect(() => {
  const user = localStorage.getItem("user");

  if (user) {
    setUser(JSON.parse(user));
  }
}, []);
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
        <Route path="/event/:id/volunteers" element={<VolunteerDashboard />} />
        <Route path="/event/:id/budget" element={<BudgetDashboard />} />
        <Route path="/event/:id/plan" element={<EventPlanDashboard />} />
        <Route path="/event/:id/ai" element={<AIDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;