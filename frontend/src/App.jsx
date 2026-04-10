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

function App() {
  
const isAuth = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<h1>Route Not Found</h1>} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
            isAuth ? <Dashboard /> : <Navigate to="/login" />
          } />
        <Route path="/create-event" element={
            isAuth ? <CreateEvent /> : <Navigate to="/login" />
          } />
        <Route path="/event/:id" element={
            isAuth ? <EventDetails /> : <Navigate to="/login" />
          } />
        <Route path="/event/:id/volunteers" element={
            isAuth ? <VolunteerDashboard /> : <Navigate to="/login" />
          } />
        <Route path="/event/:id/budget" element={
            isAuth ? <BudgetDashboard /> : <Navigate to="/login" />
          } />
        <Route path="/event/:id/plan" element={
            isAuth ? <EventPlanDashboard /> : <Navigate to="/login" />
          } />
        <Route path="/event/:id/ai" element={
            isAuth ? <AIDashboard /> : <Navigate to="/login" />
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;