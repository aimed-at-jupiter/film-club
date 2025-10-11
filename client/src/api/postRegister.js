import { API_BASE_URL } from "./config";

export function postRegister(newUser) {
  return fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          return Promise.reject({
            status: res.status,
            msg: data.msg || "Registration failed",
          });
        });
      }
      return res.json();
    })
    .catch((err) => {
      console.error("Error registering:", err);
      throw err;
    });
}
