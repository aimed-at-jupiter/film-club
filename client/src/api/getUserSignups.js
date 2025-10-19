import { fetchWithAuth } from "./fetchWithAuth";

export const getUserSignups = (token) => {
  return fetchWithAuth("/my-signups", { method: "GET" }, token).then(
    (data) => data.signups
  );
};
