import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postEvent } from "../api/postEvent";
import EventForm from "../components/EventForm";

function PostEventPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user || user.role !== "staff") {
    return <p className="text-center mt-5">Unauthorized: Staff only.</p>;
  }

  const handleSubmit = (formData) => {
    setLoading(true);
    setError(null);

    postEvent(formData)
      .then(() => {
        navigate("/"); // go back to home after success
      })
      .catch((err) => {
        console.error("Error creating event:", err);
        setError(err.msg || "Failed to create event");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      {error && (
        <div className="alert alert-danger text-center mb-3">{error}</div>
      )}
      <EventForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}

export default PostEventPage;
