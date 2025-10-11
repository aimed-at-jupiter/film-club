import { API_BASE_URL } from "./config";

export function fetchWithAuth(path, options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    return Promise.reject({
      status: 401,
      msg: "Unauthorized: Please log in first.",
    });
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  return fetch(`${API_BASE_URL}${path}`, {
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
      console.error("Error in fetchWithAuth:", err);
      throw err;
    });
}
