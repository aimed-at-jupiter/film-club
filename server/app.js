const express = require("express");
const cors = require("cors");

const { getEvents } = require("./controllers/eventsControllers");

const app = express();

app.use(cors());

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Film Club API!");
});

app.get("/api/events", getEvents);

module.exports = app;
