const app = require("./app");

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
