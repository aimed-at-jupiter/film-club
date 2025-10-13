export function prettyDate(isoDateString) {
  if (!isoDateString) return "";

  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function prettyTime(timeString) {
  if (!timeString) return "";

  return timeString.slice(0, 5);
}
