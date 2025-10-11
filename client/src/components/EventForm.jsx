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
    onSubmit(formData);
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
          />
        </div>
      ))}

      <button
        type="submit"
        className="btn btn-success w-100"
        disabled={loading}
      >
        {loading ? "Posting..." : "Post Event"}
      </button>
    </form>
  );
}

export default EventForm;
