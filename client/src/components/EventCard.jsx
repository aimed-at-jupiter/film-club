import { Link } from "react-router-dom";
import { prettyDate } from "../utils/formatters";

function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event.event_id}`}
      className="text-decoration-none text-dark"
      style={{ cursor: "pointer" }}
    >
      <div className="card h-100 shadow-sm border-0">
        <div className="row g-0">
          {/* Image column
              - p-3 on small screens to inset the image so its left edge lines up with text's left padding
              - p-md-0 on md+ so the image becomes flush-left (desktop layout)
          */}
          <div className="col-12 col-md-4 d-flex justify-content-center align-items-center p-3 p-md-0">
            <img
              src={event.film_img_url}
              alt="film poster"
              className="img-fluid"
              style={{
                width: "75%",
                maxWidth: "200px", // <<< prevents huge images on small screens
                height: "auto",
                objectFit:
                  "contain" /* ensures the whole poster is always visible */,
                borderRadius:
                  "0.375rem" /* preserves a gentle radius if you like */,
              }}
            />
          </div>

          {/* Text column
              - ps-3 on small screens so text shares the same left inset as the image
              - ps-md-4 on md+ to add a larger gap between image and text on desktop
          */}
          <div className="col-12 col-md-8">
            <div className="card-body ps-3 ps-md-4 text-center">
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
