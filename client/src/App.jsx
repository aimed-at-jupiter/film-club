import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import EventPage from "./pages/EventPage";
import PostEventPage from "./pages/PostEventPage";
import { Tooltip } from "bootstrap";

function App() {
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:event_id" element={<EventPage />} />
        <Route path="/create-event" element={<PostEventPage />} />
      </Routes>
    </>
  );
}

export default App;
