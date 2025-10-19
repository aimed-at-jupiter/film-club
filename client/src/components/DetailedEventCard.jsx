import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postSignup } from "../api/postSignup";
import { useGoogleCalendar } from "../hooks/useGoogleCalendar";
import { formatForGoogleCalendar } from "../utils/formatForGoogleCalendar";
import { prettyDate, prettyTime } from "../utils/formatters";
import { createCheckoutSession } from "../api/createCheckoutSession";
import { getUserSignups } from "../api/getUserSignups";

function DetailedEventCard({ event }) {
  const { user, token } = useAuth();
  const { addEventToCalendar } = useGoogleCalendar();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  function handleSignup() {
    setLoading(true);
    setError(null);

    postSignup(event.event_id, token)
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
  }

  function handleAddToCalendar() {
    const calendarEvent = formatForGoogleCalendar(event);

    addEventToCalendar(calendarEvent)
      .then(() => {
        alert("Event added to your Google Calendar!");
      })
      .catch(() => {
        alert("Failed to add event to calendar.");
      });
  }

  const handlePayNow = () => {
    getUserSignups(token)
      .then((signups) => {
        const alreadySignedUp = signups.some(
          (s) => s.event_id === event.event_id
        );
        if (alreadySignedUp) {
          alert("You're already signed up for this event!");
          return;
        }

        createCheckoutSession(event, token)
          .then((url) => {
            window.location.href = url;
          })
          .catch((err) => {
            console.error("Stripe checkout error:", err);
            alert(err.msg || "Failed to initiate payment");
          });
      })
      .catch((err) => {
        console.error("Failed to check signups:", err);
        alert("Could not verify signup status");
      });
  };

  return (
    <div
      className="mb-3 border-0"
      style={{ maxWidth: "1080px", transition: "none" }}
    >
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={event.film_img_url}
            className="img-fluid rounded-start"
            alt={`${event.film_title} poster`}
            style={{ height: "100%", objectFit: "cover" }}
          />
        </div>

        <div className="col-md-8">
          <div className="card-body">
            <h1 className="card-title fw-bold">{event.film_title}</h1>
            <p className="card-text">
              Join us for a {event.event_type} of the {event.film_year} film{" "}
              <em>{event.film_title}</em> by {event.film_director}.
            </p>

            <p className="card-text mb-1">{prettyDate(event.date)}</p>
            <p className="card-text mb-1">
              {prettyTime(event.start_time)} – {prettyTime(event.end_time)}
            </p>
            <p className="card-text mb-1">at {event.location}</p>
            <p className="card-text">£{event.price}</p>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Hide Film Info ▲" : "Show More Info ▼"}
            </button>

            <div
              className={`film-info-transition ${
                showMore ? "show" : "hide"
              } mt-3 border-top pt-2`}
            >
              <div className="film-info-content">
                {event.film_plot && (
                  <p className="text-start mb-1">
                    <strong>Plot:</strong> {event.film_plot}
                  </p>
                )}
                {event.film_genre && (
                  <p className="text-start mb-1">
                    <strong>Genre:</strong> {event.film_genre}
                  </p>
                )}
                {event.film_writer && (
                  <p className="text-start mb-1">
                    <strong>Writer:</strong> {event.film_writer}
                  </p>
                )}
                {event.film_actors && (
                  <p className="text-start mb-1">
                    <strong>Lead Actors:</strong> {event.film_actors}
                  </p>
                )}
                {event.film_runtime && (
                  <p className="text-start mb-1">
                    <strong>Runtime:</strong> {event.film_runtime}
                  </p>
                )}
                {event.film_country && (
                  <p className="text-start mb-1">
                    <strong>Country:</strong> {event.film_country}
                  </p>
                )}
                {event.film_language && (
                  <p className="text-start mb-1">
                    <strong>Language:</strong> {event.film_language}
                  </p>
                )}
              </div>
            </div>

            {user ? (
              <div className="d-grid gap-2 d-md-block">
                <>
                  {event.price > 0 ? (
                    <button
                      className="btn btn-primary me-md-2"
                      onClick={handlePayNow}
                    >
                      Buy Ticket
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary me-md-2"
                      onClick={handleSignup}
                      disabled={loading || success}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                            aria-live="polite"
                            aria-label="Loading"
                          ></span>
                          Loading...
                        </>
                      ) : success ? (
                        "Signed up!"
                      ) : (
                        "Sign up"
                      )}
                    </button>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={handleAddToCalendar}
                    disabled={!success}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={
                      success
                        ? "Add this event to your Google Calendar"
                        : "Sign up first to enable this"
                    }
                    style={{
                      opacity: success ? 1 : 0.6,
                      cursor: success ? "pointer" : "not-allowed",
                    }}
                  >
                    Add to Google Calendar
                  </button>
                </>
              </div>
            ) : (
              <p className="text-muted mt-3">
                <small>Log in to sign up for this event.</small>
              </p>
            )}

            {success && <p className="text-success mt-2">You’re signed up!</p>}

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
