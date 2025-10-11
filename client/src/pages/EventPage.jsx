import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvents } from "../api/getEvents";
import DetailedEventCard from "../components/DetailedEventCard";

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
    return <div className="spinner-border text-primary" role="status"></div>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <div className="container mt-4">
      <DetailedEventCard event={event} />
    </div>
  );
}

export default EventPage;
