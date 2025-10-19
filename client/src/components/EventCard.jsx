import { Link } from "react-router-dom";
import { prettyDate } from "../utils/formatters";

function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event.event_id}`}
      className="text-decoration-none text-dark"
      style={{ cursor: "pointer" }}
    >
      <div
        className="card mb-3 border-0 h-100 shadow-sm hover-shadow transition-all"
        style={{ maxWidth: "540px", transition: "border-color 0.2s ease" }}
      >
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={event.film_img_url}
              className="img-fluid rounded-start"
              alt="film poster"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{event.film_title}</h5>
              <p className="card-text">{prettyDate(event.date)}</p>
              <p className="card-text">{event.location}</p>
              <p className="card-text">
                <small className="text-body-secondary">
                  {event.event_type}
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
