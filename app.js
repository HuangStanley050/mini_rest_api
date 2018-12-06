const express = require("express");
const path = require("path");
const connectionString = require("./mongoString.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed.js");
const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "application/json"
  );
  next();
});
app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    connectionString.connect_string,
    { useNewUrlParser: true }
  )
  .then(result => app.listen(8080, () => console.log("server running")))
  .catch(err => console.log(err));
