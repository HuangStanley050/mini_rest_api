const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed.js");
router.get("/posts");
module.exports = router;
