const { addSignup } = require("../models/signupsModels");

const postSignup = (request, response, next) => {
  const { user_id, event_id } = request.body;

  if (!user_id || !event_id) {
    return response
      .status(400)
      .send({ msg: "Bad request: missing user_id or event_id" });
  }

  addSignup(user_id, event_id)
    .then((signup) => {
      response.status(201).send({ signup });
    })
    .catch(next);
};
module.exports = { postSignup };
