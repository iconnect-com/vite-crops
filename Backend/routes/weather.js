const express = require("express");
const {
    getWeather
} = require("../controllers/weather");
const { protect,  } = require("../middleware/auth");
//const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").get(protect, getWeather);


module.exports = router;