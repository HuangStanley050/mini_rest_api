const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed.js");
const app = express();

app.use(bodyParser.json());
app.use("/feed", feedRoutes);
app.listen(8080, () => console.log("server running"));
