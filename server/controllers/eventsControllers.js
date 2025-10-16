const {
  fetchEvents,
  fetchEventById,
  addEvent,
} = require("../models/eventsModels");

const getEvents = (request, response, next) => {
  fetchEvents()
    .then((events) => {
      response.status(200).send({ events });
    })
    .catch(next);
};

const getEventById = (request, response, next) => {
  const { event_id } = request.params;

  fetchEventById(event_id)
    .then((event) => {
      response.status(200).send({ event });
    })
    .catch(next);
};

const postEvent = (request, response, next) => {
  const {
    date,
    start_time,
    end_time,
    location,
    film_title,
    film_year,
    film_director,
    film_writer,
    film_plot,
    film_genre,
    film_actors,
    film_runtime,
    film_country,
    film_language,
    film_img_url,
    film_imdb_id,
    event_type,
    price,
  } = request.body;

  // Basic validation
  if (
    !date ||
    !start_time ||
    !end_time ||
    !location ||
    !film_title ||
    !film_director ||
    !film_year ||
    !event_type ||
    price === undefined
  ) {
    return response.status(400).send({ msg: "Missing required fields" });
  }

  if (!["discussion", "screening"].includes(event_type)) {
    return response.status(400).send({ msg: "Invalid event type" });
  }
  const year = Number(film_year);
  if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 1) {
    return response.status(400).send({ msg: "Invalid film year" });
  }

  addEvent({
    date,
    start_time,
    end_time,
    location,
    film_title,
    film_year,
    film_director,
    film_writer,
    film_plot,
    film_genre,
    film_actors,
    film_runtime,
    film_country,
    film_language,
    film_img_url,
    film_imdb_id,
    event_type,
    price,
  })
    .then((newEvent) => {
      response.status(201).send({ event: newEvent });
    })
    .catch(next);
};

module.exports = { getEvents, getEventById, postEvent };
