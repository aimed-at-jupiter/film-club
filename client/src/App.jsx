import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import EventPage from "./pages/EventPage";
import PostEventPage from "./pages/PostEventPage";

function App() {
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
