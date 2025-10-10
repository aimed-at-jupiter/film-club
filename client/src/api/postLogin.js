import { API_BASE_URL } from "./config";

export function postLogin(credentials) {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          return Promise.reject({
            status: res.status,
            msg: data.msg || "Login failed",
          });
        });
      }
      return res.json();
    })
    .catch((err) => {
      console.error("Error logging in:", err);
      throw err;
    });
}
