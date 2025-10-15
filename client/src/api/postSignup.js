import { fetchWithAuth } from "./fetchWithAuth";

export function postSignup(event_id, token) {
  return fetchWithAuth(
    "/signups",
    {
      method: "POST",
      body: JSON.stringify({ event_id }),
    },
    token
  );
}
