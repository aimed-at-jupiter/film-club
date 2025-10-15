import { fetchWithAuth } from "./fetchWithAuth";

export function postEvent(eventData, token) {
  return fetchWithAuth(
    "/events",
    {
      method: "POST",
      body: JSON.stringify(eventData),
    },
    token
  );
}
