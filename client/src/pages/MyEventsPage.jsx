import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserSignups } from "../api/getUserSignups";
import EventCard from "../components/EventCard";
import ErrorAlert from "../components/ErrorAlert";

function MyEventsPage() {
  const { token, user } = useAuth();
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserSignups = () => {
    getUserSignups(token)
      .then((data) => {
        setSignups(data);
      })
      .catch((err) => {
        console.error("Error fetching user signups:", err);
        setError(err.msg || "Failed to load your events. Please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserSignups();
  }, [token]);

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center mt-5"
        role="status"
        aria-live="polite"
      >
        <div
          className="spinner-border text-primary"
          role="status"
          aria-label="Loading your events"
        ></div>
        <p className="mt-3">Loading your events, please wait…</p>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={fetchUserSignups} />;
  }

  if (signups.length === 0) {
    return (
      <main className="container mt-5 text-center" role="main">
        <h3 className="mb-3 text-center" tabIndex="-1" aria-live="polite">
          {user ? `${user.username}'s Events` : "My Events"}
        </h3>
        <p className="text-center text-muted" role="status" aria-live="polite">
          You haven’t signed up for any events yet.
        </p>
      </main>
    );
  }

  return (
    <main className="container mt-4" role="main">
      <h3 className="mb-3 text-center" tabIndex="-1" aria-live="polite">
        {user ? `${user.username}'s events` : "My events"}
      </h3>

      <div className="row" aria-label="List of your upcoming events">
        {signups.map((signup) => (
          <div className="col-md-4 mb-4" key={signup.signup_id}>
            <EventCard event={signup} />
          </div>
        ))}
      </div>

      <div className="visually-hidden" aria-live="polite">
        Showing {signups.length} of your signed-up events
      </div>
    </main>
  );
}

export default MyEventsPage;
