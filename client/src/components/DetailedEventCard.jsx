import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postSignup } from "../api/postSignup";
// import { useGoogleCalendar } from "../hooks/useGoogleCalendar";
// import { formatForGoogleCalendar } from "../utils/formatForGoogleCalendar";
import { buildGoogleCalendarUrl } from "../utils/formatForGoogleCalendar";

import { prettyDate, prettyTime } from "../utils/formatters";
import { createCheckoutSession } from "../api/createCheckoutSession";
import { useEffect } from "react";

function DetailedEventCard({ event, userSignups, setUserSignups }) {
  const { user, token } = useAuth();
  // const { addEventToCalendar } = useGoogleCalendar();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!userSignups || !event) return;

    const alreadySignedUp = userSignups.some(
      (s) => s.event_id === event.event_id
    );

    if (alreadySignedUp) setSuccess(true);
  }, [userSignups, event]);

  function handleSignup() {
    setLoading(true);
    setError(null);

    postSignup(event.event_id, token)
      .then(() => {
        setSuccess(true);
        if (setUserSignups) {
          setUserSignups([...userSignups, { event_id: event.event_id }]);
        }
      })
      .catch((err) => {
        console.error("Signup failed:", err);
        setError(err.msg || "Signup failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleAddToCalendar() {
    const calendarUrl = buildGoogleCalendarUrl(event);
    window.open(calendarUrl, "_blank", "noopener,noreferrer");
  }

  // function handleAddToCalendar() {
  //   const calendarEvent = formatForGoogleCalendar(event);

  //   addEventToCalendar(calendarEvent)
  //     .then(() => {
  //       alert("Event added to your Google Calendar!");
  //     })
  //     .catch(() => {
  //       alert("Failed to add event to calendar.");
  //     });
  // }

  const handlePayNow = () => {
    if (!user || !token) return;

    const alreadySignedUp = userSignups.some(
      (s) => s.event_id === event.event_id
    );

    if (alreadySignedUp) {
      alert("You're already signed up for this event!");
      return;
    }
    setLoading(true);
    createCheckoutSession(event, token)
      .then((url) => {
        window.location.href = url;
      })
      .catch((err) => {
        console.error("Stripe checkout error:", err);
        alert(err.msg || "Failed to initiate payment");
      })
      .catch((err) => {
        console.error("Failed to check signups:", err);
        alert("Could not verify signup status");
      })
      .finally(() => setLoading(false));
  };

  return (
    <main
      className="mb-3 border-0"
      style={{ maxWidth: "1080px", transition: "none" }}
      role="region"
      aria-label={`Details for ${event.film_title}`}
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
              aria-expanded={showMore}
              aria-controls="film-info"
            >
              {showMore ? "Hide Film Info ▲" : "Show More Info ▼"}
            </button>

            <div
              id="film-info"
              className={`film-info-transition ${
                showMore ? "show" : "hide"
              } mt-3 border-top pt-2`}
            >
              {[
                { label: "Plot", value: event.film_plot },
                { label: "Genre", value: event.film_genre },
                { label: "Writer", value: event.film_writer },
                { label: "Lead Actors", value: event.film_actors },
                { label: "Runtime", value: event.film_runtime },
                { label: "Country", value: event.film_country },
                { label: "Language", value: event.film_language },
              ].map(
                (info) =>
                  info.value && (
                    <p className="text-start mb-1" key={info.label}>
                      <strong>{info.label}:</strong> {info.value}
                    </p>
                  )
              )}
            </div>

            {error && (
              <div
                className="alert alert-danger mt-2 py-1"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {user ? (
              <div className="d-grid gap-2 d-md-block mt-3">
                <>
                  {event.price > 0 ? (
                    <button
                      className="btn btn-primary me-md-2"
                      onClick={handlePayNow}
                      aria-busy={loading}
                    >
                      {loading ? "Processing..." : "Buy Ticket"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary me-md-2"
                      onClick={handleSignup}
                      disabled={loading || success}
                      aria-busy={loading}
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
                    aria-disabled={!success}
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

            {success && (
              <p className="text-success mt-2" aria-live="polite">
                You’re signed up!
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default DetailedEventCard;
