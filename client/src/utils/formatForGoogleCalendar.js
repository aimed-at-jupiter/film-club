export function formatForGoogleCalendar(event) {
  const start = new Date(`${event.date.split("T")[0]}T${event.start_time}`);
  const end = new Date(`${event.date.split("T")[0]}T${event.end_time}`);

  return {
    summary: event.film_title,
    location: event.location,
    description: ` Film Club ${event.event_type} of ${event.film_title} (${event.film_year}), directed by ${event.film_director}.`,
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

export function buildGoogleCalendarUrl(event) {
  const formatted = formatForGoogleCalendar(event);

  const formatDate = (isoString) =>
    isoString.replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: formatted.summary,
    details: formatted.description,
    location: formatted.location,
    dates: `${formatDate(formatted.start.dateTime)}/${formatDate(
      formatted.end.dateTime
    )}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
