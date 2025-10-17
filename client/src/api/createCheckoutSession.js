import { fetchWithAuth } from "./fetchWithAuth";

export const createCheckoutSession = (event, token) => {
  return fetchWithAuth(
    "/create-checkout-session",
    {
      method: "POST",
      body: JSON.stringify(event),
    },
    token
  ).then((data) => data.url);
};
