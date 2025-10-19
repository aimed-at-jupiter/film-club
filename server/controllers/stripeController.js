const { createCheckoutSession } = require("../models/stripeModel");
const { checkIfUserSignedUp } = require("../models/signupsModels");

const postStripeSession = (request, response, next) => {
  const userId = request.user.user_id;
  const eventData = request.body;

  checkIfUserSignedUp(userId, eventData.event_id)
    .then((alreadySignedUp) => {
      if (alreadySignedUp) {
        return Promise.reject({
          status: 409,
          msg: "Already signed up for this event",
        });
      }
      return createCheckoutSession(eventData);
    })
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
