const { fetchEvents } = require("../models/eventsModels");

const getEvents = (request, response, next) => {
  fetchEvents()
    .then((events) => {
      response.status(200).send({ events });
    })
    .catch(next);
};

module.exports = { getEvents };
