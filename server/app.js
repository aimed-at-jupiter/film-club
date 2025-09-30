const express = require("express");
const cors = require("cors");

const { getEvents, getEventById } = require("./controllers/eventsControllers");

const app = express();

app.use(cors());

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Film Club API!");
});

app.get("/api/events", getEvents);

app.get("/api/events/:id", getEventById);

// custom errors from models
app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    // Postgres invalid text representation (bad ID type)
    response.status(400).send({ msg: "Bad request" });
  } else {
    console.error(err);
    response.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
