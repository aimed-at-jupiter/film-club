import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvents } from "../api/getEvents";
import { getUserSignups } from "../api/getUserSignups";
import DetailedEventCard from "../components/DetailedEventCard";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../context/AuthContext";

function EventPage() {
  const { event_id } = useParams();
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userSignups, setUserSignups] = useState([]);
  const [signupsLoading, setSignupsLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEvents(event_id)
      .then((data) => {
        setEvent(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.msg || "Failed to fetch event");
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [event_id]);

  useEffect(() => {
    if (!user || !token) {
      setSignupsLoading(false);
      return;
    }

    setSignupsLoading(true);
    getUserSignups(token)
      .then((signups) => setUserSignups(signups))
      .catch((err) => console.error("Failed to fetch user signups:", err))
      .finally(() => setSignupsLoading(false));
  }, [user, token]);

  if (loading || signupsLoading)
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
          setError(null);
          setLoading(true);
          getEvents(event_id)
            .then((data) => {
              setEvent(data);
            })
            .catch((err) => {
              setError(err.msg || "Failed to fetch event");
            })
            .finally(() => setLoading(false));
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
      <DetailedEventCard
        event={event}
        userSignups={userSignups}
        setUserSignups={setUserSignups}
      />
    </main>
  );
}

export default EventPage;
