const { addSignup, fetchSignupsByUser } = require("../models/signupsModels");

const postSignup = (request, response, next) => {
  const user_id = request.user.id; // extracted from JWT by requireAuth
  const { event_id } = request.body;

  if (!event_id) {
    return response.status(400).send({ msg: "Bad request: missing event_id" });
  }

  addSignup(user_id, event_id)
    .then((signup) => {
      response.status(201).send({ signup });
    })
    .catch(next);
};

const getUserSignups = (request, response, next) => {
  const user_id = request.user.id;

  fetchSignupsByUser(user_id)
    .then((signups) => {
      response.status(200).send({ signups });
    })
    .catch(next);
};
module.exports = { postSignup, getUserSignups };
