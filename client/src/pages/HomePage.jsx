import { getEvents } from "../api/getEvents";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEventFilter } from "../context/EventFilterContext";
import EventCard from "../components/EventCard";
import ErrorAlert from "../components/ErrorAlert";

function HomePage() {
  const { user } = useContext(AuthContext);
  const { filter, setFilter } = useEventFilter();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleFilterChange = (event) => {
      setFilter(event.detail);
    };
    window.addEventListener("setFilter", handleFilterChange);
    return () => window.removeEventListener("setFilter", handleFilterChange);
  }, [setFilter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam) setFilter(filterParam);
  }, [location.search, setFilter]);

  const fetchEvents = () => {
    setLoading(true);
    setError(null);

    getEvents()
      .then((events) => {
        setEvents(events);
      })
      .catch((err) => {
        console.error(err, "<<< error from getEvents");
        setError(err.msg || "Failed to fetch events");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const now = new Date();

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    if (user?.role !== "staff" && eventDate < now) return false;

    if (filter === "all") return true;
    return event.event_type.toLowerCase() === filter;
  });

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
          aria-label="Loading events"
        ></div>
        <p className="mt-3">Loading events, please wait…</p>
      </div>
    );

  if (error) {
    return <ErrorAlert message={error} onRetry={fetchEvents} />;
  }

  if (!filteredEvents.length) {
    return (
      <p className="text-center mt-5" role="status" aria-live="polite">
        No {filter !== "all" ? filter : ""} events found
      </p>
    );
  }

  return (
    <main className="container mt-4" role="main">
      <h3 className="mb-3 text-center" tabIndex="-1" aria-live="polite">
        {user
          ? `Welcome back, ${user.username || user.email}!`
          : "Welcome to Film Club!"}
      </h3>

      <div className="row" aria-label="List of upcoming events">
        {filteredEvents.map((event) => (
          <div className="col-md-4 mb-4" key={event.event_id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>

      <div className="visually-hidden" aria-live="polite">
        Showing {filter} events
      </div>
    </main>
  );
}

export default HomePage;
