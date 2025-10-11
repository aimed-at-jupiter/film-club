import { fetchWithAuth } from "./fetchWithAuth";

export function postSignup(event_id) {
  return fetchWithAuth("/signups", {
    method: "POST",
    body: JSON.stringify({ event_id }),
  });
}
