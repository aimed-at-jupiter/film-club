import { fetchWithAuth } from "./fetchWithAuth";

export const getUserSignups = (token) => {
  return fetchWithAuth("/api/my-signups", {}, token).then(
    (data) => data.signups
  );
};
