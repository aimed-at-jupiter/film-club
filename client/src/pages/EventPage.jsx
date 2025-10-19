import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvents } from "../api/getEvents";
import DetailedEventCard from "../components/DetailedEventCard";
import ErrorAlert from "../components/ErrorAlert";

function EventPage() {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getEvents(event_id)
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.msg || "Failed to fetch event");
        setLoading(false);
      });
  }, [event_id]);
  if (loading)
    return (
      <div
        className="d-flex flex-column align-items-center mt-5"
        role="status"
        aria-live="polite"
      >
        <div
          className="spinner-border text-primary"
          role="status"
          aria-label="Loading event details"
        ></div>
        <p className="mt-3">Loading event details, please wait…</p>
      </div>
    );

  if (error)
    return (
      <ErrorAlert
        message={error}
        onRetry={() => {
          setLoading(true);
          setError(null);
          getEvents(event_id)
            .then((data) => {
              setEvent(data);
              setLoading(false);
            })
            .catch((err) => {
              setError(err.msg || "Failed to fetch event");
              setLoading(false);
            });
        }}
      />
    );

  if (!event)
    return (
      <p className="text-center mt-5" role="status" aria-live="polite">
        No event found.
      </p>
    );

  return (
    <main className="container mt-3" role="main">
      <DetailedEventCard event={event} />
    </main>
  );
}

export default EventPage;
