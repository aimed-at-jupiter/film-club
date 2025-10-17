import { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import EventPage from "./pages/EventPage";
import MyEventsPage from "./pages/MyEventsPage";
import PostEventPage from "./pages/PostEventPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import { Tooltip } from "bootstrap";
import { EventFilterProvider } from "./context/EventFilterContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);

  return (
    <AuthProvider>
      <EventFilterProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:event_id" element={<EventPage />} />
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/create-event" element={<PostEventPage />} />
        </Routes>
      </EventFilterProvider>
    </AuthProvider>
  );
}

export default App;
