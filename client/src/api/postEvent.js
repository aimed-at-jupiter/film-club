import { fetchWithAuth } from "./fetchWithAuth";

export function postEvent(eventData) {
  return fetchWithAuth("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}
