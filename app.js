const express = require("express");
const connectionString = require("./mongoString.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed.js");
const app = express();

app.use(bodyParser.json());
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
//const path = connectionString.connect_string;
console.log(connectionString);
mongoose
  .connect(
    connectionString.connect_string,
    { useNewUrlParser: true }
  )
  .then(result => app.listen(8080, () => console.log("server running")))
  .catch(err => console.log(err));
