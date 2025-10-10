// client/src/api/fetchWithAuth.js
import { API_BASE_URL } from "./config";

export function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          return Promise.reject({
            status: res.status,
            msg: data.msg || "Request failed",
          });
        });
      }
      return res.json();
    })
    .catch((err) => {
      console.error("Error fetching:", err);
      throw err;
    });
}
