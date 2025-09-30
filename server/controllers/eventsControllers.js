const { fetchEvents, fetchEventById } = require("../models/eventsModels");

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

module.exports = { getEvents, getEventById };
