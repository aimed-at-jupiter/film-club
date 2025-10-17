const { createCheckoutSession } = require("../models/stripeModel");

const postStripeSession = (request, response, next) => {
  const eventData = request.body;

  createCheckoutSession(eventData)
    .then((session) => {
      response.status(200).send(session);
    })
    .catch((err) => {
      if (err.status && err.msg) {
        response.status(err.status).send({ msg: err.msg });
      } else {
        next(err);
      }
    });
};

module.exports = { postStripeSession };
