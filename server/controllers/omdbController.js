const { fetchOmdbData } = require("../models/omdbModel");

const getOmdbData = (req, res, next) => {
  const { title, year } = req.query;

  fetchOmdbData(title, year)
    .then((filmData) => {
      res.status(200).send({ film: filmData });
    })
    .catch((err) => {
      if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
      } else {
        next(err);
      }
    });
};

module.exports = { getOmdbData };
