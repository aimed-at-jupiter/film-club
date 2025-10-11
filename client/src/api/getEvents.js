import { API_BASE_URL } from "./config";

export function getEvents(event_id) {
  let path = `${API_BASE_URL}/events`;

  if (event_id) path += `/${event_id}`;

  return fetch(path)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject({
          status: res.status,
          msg: event_id
            ? `Couldn't fetch event with id ${event_id}`
            : "Couldn't fetch events",
        });
      }
      return res.json();
    })
    .then((data) => {
      if (event_id) return data.event; // single event object
      return data.events; // array
    })
    .catch((err) => {
      console.error("Error fetching event(s):", err);
      throw err;
    });
}
