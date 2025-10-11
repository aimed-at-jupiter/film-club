import { getEvents } from "../api/getEvents";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import EventCard from "../components/EventCard";

function HomePage() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

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

  if (loading)
    return <div className="spinner-border text-primary" role="status"></div>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!events) return <p>No events found.</p>;

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
        {events.map((event) => (
          <div className="col-md-4 mb-4" key={event.event_id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
