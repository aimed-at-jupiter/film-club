import { getEvents } from "../api/getEvents";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEventFilter } from "../context/EventFilterContext";
import EventCard from "../components/EventCard";

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
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam) setFilter(filterParam);
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then((events) => {
        setEvents(events);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err, "<<< error from getEvents");
        setError(err.msg || "Failed to fetch events");
        setLoading(false);
      });
  }, []);

  const now = new Date();

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    if (user?.role !== "staff" && eventDate < now) return false;

    if (filter === "all") return true;
    return event.event_type.toLowerCase() === filter;
  });

  if (loading)
    return <div className="spinner-border text-primary" role="status"></div>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!filteredEvents.length) return <p>No events found.</p>;

  return (
    <div className="container mt-4">
      {user ? (
        <h3 className="mb-3 text-center">
          Welcome back, {user.username || user.email}!
        </h3>
      ) : (
        <h3 className="mb-3 text-center">Welcome to Film Club!</h3>
      )}

      <div className="row">
        {filteredEvents.map((event) => (
          <div className="col-md-4 mb-4" key={event.event_id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
