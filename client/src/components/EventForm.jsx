import { useState } from "react";

function EventForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    film_title: "",
    film_year: "",
    film_director: "",
    film_img_url: "",
    event_type: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData).then(() => {
      setFormData({
        film_title: "",
        film_year: "",
        film_director: "",
        film_img_url: "",
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

      {Object.keys(formData).map((key) => (
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
        className="btn btn-success w-100 d-flex justify-content-center align-items-center gap-2"
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
