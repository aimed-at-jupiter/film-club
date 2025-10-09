import { API_BASE_URL } from "../api/config";

import { API_BASE_URL } from "./config";

export function getEvents(eventId) {
  let path = `${API_BASE_URL}/events`;

  if (eventId) {
    path = `${API_BASE_URL}/events/${eventId}`;
  }

  return fetch(path)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject({
          status: res.status,
          msg: "Couldn't fetch events",
        });
      }
      return res.json();
    })
    .catch((err) => {
      console.error("Error fetching events:", err);
      throw err;
    });
}
