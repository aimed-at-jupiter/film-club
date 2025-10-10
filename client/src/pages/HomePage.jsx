import { getEvents } from "../api/getEvents";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import EventCard from "../components/EventCard";

function HomePage() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    getEvents()
      .then((body) => {
        const { events } = body;
        setEventsData(events);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err, "<<< error from getEvents");
      });
  }, []);

  if (loading)
    return <div className="spinner-border text-primary" role="status"></div>;

  return (
    <div className="container mt-4">
      {user ? (
        <h3 className="mb-3 text-center">
          Welcome back, {user.name || user.email}!
        </h3>
      ) : (
        <h3 className="mb-3 text-center">Welcome to Film Club!</h3>
      )}

      <div className="row">
        {eventsData.map((event) => (
          <div className="col-md-4 mb-4" key={event.event_id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
