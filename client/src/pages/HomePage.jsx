import { getEvents } from "../api/getEvents";
import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";

function HomePage() {
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
        console.log(err, "<<< error from getEvents");
      });
  }, []);

  return loading ? (
    <p>Loading...</p>
  ) : (
    <>
      {eventsData.map((event) => {
        return <EventCard key={event.event_id} event={event} />;
      })}
    </>
  );
}

export default HomePage;
