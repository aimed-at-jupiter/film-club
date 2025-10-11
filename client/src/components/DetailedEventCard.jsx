import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postSignup } from "../api/postSignup";

function DetailedEventCard({ event }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = () => {
    setLoading(true);
    setError(null);

    postSignup(event.event_id)
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        console.error("Signup failed:", err);
        setError(err.msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="card shadow-sm mb-3 border-0" style={{ maxWidth: "540px" }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={event.film_img_url}
            className="img-fluid rounded-start"
            alt={`${event.film_title} poster`}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title fw-bold">{event.film_title}</h5>
            <p className="card-text">
              Join us for a {event.event_type} of the {event.film_year} film{" "}
              <em>{event.film_title}</em> by {event.film_director}.
            </p>
            <p className="card-text mb-1">{event.date}</p>
            <p className="card-text mb-1">
              {event.start_time} – {event.end_time}
            </p>
            <p className="card-text mb-1">📍 {event.location}</p>
            <p className="card-text">£{event.price}</p>

            {user ? (
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleSignup}
                disabled={loading || success}
              >
                {loading ? "Signing up..." : success ? "Signed up!" : "Sign up"}
              </button>
            ) : (
              <p className="text-muted mt-3">
                <small>Log in to sign up for this event.</small>
              </p>
            )}

            {success && (
              <p className="text-success mt-2">
                You’re signed up! Check your email for confirmation.
              </p>
            )}

            {error && (
              <div className="alert alert-danger mt-2 py-1">{error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedEventCard;
