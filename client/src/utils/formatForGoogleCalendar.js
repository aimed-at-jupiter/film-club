// utils/formatForGoogleCalendar.js
export function formatForGoogleCalendar(event) {
  const start = new Date(`${event.date.split("T")[0]}T${event.start_time}`);
  const end = new Date(`${event.date.split("T")[0]}T${event.end_time}`);

  return {
    summary: event.film_title,
    location: event.location,
    description: `${event.event_type} of ${event.film_title} (${event.film_year}), directed by ${event.film_director}.`,
    start: {
      dateTime: start.toISOString(),
      timeZone: "Europe/London",
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "Europe/London",
    },
  };
}
