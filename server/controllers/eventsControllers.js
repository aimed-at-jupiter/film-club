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
  const { id } = request.params;

  fetchEventById(id)
    .then((event) => {
      response.status(200).send({ event });
    })
    .catch(next); // error middleware will handle 404/500
};

const postEvent = (request, response, next) => {
  const {
    date,
    start_time,
    end_time,
    location,
    film_title,
    film_director,
    film_year,
    film_img_url,
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
    return response.status(400).send({ msg: "Invalid event_type" });
  }

  if (
    typeof film_year !== "number" ||
    film_year < 1880 ||
    film_year > new Date().getFullYear()
  ) {
    return response.status(400).send({ msg: "Invalid film_year" });
  }

  addEvent({
    date,
    start_time,
    end_time,
    location,
    film_title,
    film_director,
    film_year,
    film_img_url,
    event_type,
    price,
  })
    .then((newEvent) => {
      response.status(201).send({ event: newEvent });
    })
    .catch(next);
};

module.exports = { getEvents, getEventById, postEvent };
