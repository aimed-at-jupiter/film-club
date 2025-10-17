import { fetchWithAuth } from "./fetchWithAuth";

export const createCheckoutSession = (event, token) => {
  return fetchWithAuth("/api/create-checkout-session", token, {
    method: "POST",
    body: JSON.stringify(event),
  }).then((res) => {
    return res.url;
  });
};
