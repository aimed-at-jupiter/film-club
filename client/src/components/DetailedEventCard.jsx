function DetailedEventCard({ event }) {
  return (
    <div className="card mb-3" style={{ maxWidth: "540px" }}>
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
            <h5 className="card-title">{event.title}</h5>
            <p className="card-text">
              {event.film_year} film by {event.film_director}
            </p>
            <p className="card-text">{event.date}</p>
            <p className="card-text">
              {event.start_time} - {event.end_time}
            </p>
            <p className="card-text">at {event.location}</p>
            <p className="card-text">£{event.price}</p>
            <p className="card-text">
              <small className="text-body-secondary">{event.event_type}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedEventCard;
