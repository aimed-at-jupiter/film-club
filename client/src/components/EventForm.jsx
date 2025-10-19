import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOmdbData } from "../api/getOmdbData";

function EventForm({ onSubmit, loading, success }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    film_title: "",
    film_year: "",
    film_director: "",
    film_writer: "",
    film_plot: "",
    film_genre: "",
    film_actors: "",
    film_runtime: "",
    film_country: "",
    film_language: "",
    film_img_url: "",
    film_imdb_id: "",
    event_type: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    price: "",
  });

  const [omdbLoading, setOmdbLoading] = useState(false);
  const [omdbError, setOmdbError] = useState(null);

  const fetchOmdbData = () => {
    if (!formData.film_title) return;

    setOmdbLoading(true);
    setOmdbError(null);

    getOmdbData(formData.film_title, formData.film_year, token)
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
      })
      .catch((err) => {
        console.error("OMDb fetch failed:", err);
        setOmdbError(err.msg || "Couldn't fetch film data.");
      })
      .finally(() => {
        setOmdbLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedData = {
      ...formData,
      film_year: formData.film_year ? parseInt(formData.film_year, 10) : null,
    };
    onSubmit(normalizedData).then(() => {
      setFormData({
        film_title: "",
        film_year: "",
        film_director: "",
        film_writer: "",
        film_plot: "",
        film_genre: "",
        film_actors: "",
        film_runtime: "",
        film_country: "",
        film_language: "",
        film_img_url: "",
        film_imdb_id: "",
        event_type: "",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
        price: "",
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
      <h4 className="mb-4 text-center">Create New Event</h4>

      <div className="mb-4">
        <label className="form-label">Search OMDb</label>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            name="film_title"
            value={formData.film_title}
            onChange={handleChange}
            placeholder="Film Title"
            required
          />
          <input
            type="number"
            className="form-control"
            name="film_year"
            value={formData.film_year}
            onChange={handleChange}
            placeholder="Year"
            style={{ maxWidth: "120px" }}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={fetchOmdbData}
            disabled={omdbLoading}
          >
            {omdbLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Search"
            )}
          </button>
        </div>
        <small className="text-muted">
          Search by title, or by title and year for better accuracy.
        </small>
        {omdbError && <div className="text-danger mt-1">{omdbError}</div>}
      </div>

      <h5 className="mt-4 mb-3 border-bottom pb-2">Film Details</h5>

      {formData.film_img_url && (
        <div className="text-center my-3">
          <img
            src={formData.film_img_url}
            alt="Film poster"
            className="img-fluid rounded shadow-sm"
            style={{ maxWidth: "200px", borderRadius: "8px" }}
          />
        </div>
      )}

      {[
        "film_director",
        "film_writer",
        "film_genre",
        "film_actors",
        "film_runtime",
        "film_country",
        "film_language",
        "film_plot",
      ].map((key) => (
        <div className="mb-3" key={key}>
          <label className="form-label text-capitalize">
            {key.replace(/film_/, "").replace(/_/g, " ")}
          </label>
          {key === "film_plot" ? (
            <textarea
              className="form-control"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              rows="3"
            />
          ) : (
            <input
              type="text"
              className="form-control"
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          )}
        </div>
      ))}

      <h5 className="mt-4 mb-3 border-bottom pb-2">Event Details</h5>

      <div className="mb-3">
        <label className="form-label">Event Type</label>
        <select
          className="form-select"
          name="event_type"
          value={formData.event_type}
          onChange={handleChange}
          required
          disabled={loading || success}
        >
          <option value="discussion">Discussion</option>
          <option value="screening">Screening</option>
        </select>
      </div>

      {["date", "start_time", "end_time", "location", "price"].map((key) => (
        <div className="mb-3" key={key}>
          <label className="form-label text-capitalize">
            {key.replace(/_/g, " ")}
          </label>
          <input
            type={
              key.includes("date")
                ? "date"
                : key.includes("time")
                ? "time"
                : key === "price"
                ? "number"
                : "text"
            }
            className="form-control"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            required={!["film_img_url", "price"].includes(key)}
            disabled={loading || success}
          />
        </div>
      ))}

      <button
        type="submit"
        className="btn btn-success w-100 d-flex justify-content-center align-items-center gap-2 mt-3"
        disabled={loading || success}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Posting...
          </>
        ) : success ? (
          "Event Posted!"
        ) : (
          "Post Event"
        )}
      </button>

      {success && (
        <div className="alert alert-success mt-3 text-center">
          Event created successfully!
        </div>
      )}
    </form>
  );
}

export default EventForm;
