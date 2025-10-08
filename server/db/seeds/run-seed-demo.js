const demoData = require("../data/demo-data");
const seed = require("./seed.js");
const db = require("../connection.js");

process.env.NODE_ENV = "demo";

const runSeedDemo = () => {
  return seed(demoData).then(() => db.end());
};

runSeedDemo();
