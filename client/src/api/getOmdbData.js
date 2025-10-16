import { fetchWithAuth } from "./fetchWithAuth";

export function getOmdbData(title, year, token) {
  if (!title || String(title).trim() === "") {
    return Promise.reject({ status: 400, msg: "Title is required" });
  }

  const params = new URLSearchParams({ title: title.trim() });
  if (year) params.append("year", String(year).trim());

  return fetchWithAuth(`/omdb?${params.toString()}`, {}, token)
    .then((res) => {
      if (!res || !res.film) {
        return Promise.reject({
          status: 500,
          msg: "Invalid response from server",
        });
      }
      return res.film;
    })
    .catch((err) => {
      console.error("getOmdbData error:", err);
      return Promise.reject(err);
    });
}
