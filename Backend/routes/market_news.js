const express = require("express");
const {
  addMarketNews,
  getMarketNews,
  getMarketNew,
  updateMarketNews,
  deleteMarketNews,
} = require("../controllers/market_news");
const { protect, authorize  } = require("../middleware/auth");
const MarketNews = require('../models/Market_News');
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").post(protect, authorize('Admin'), addMarketNews).get(advancedResults(MarketNews), getMarketNews);
router.route("/:id").put(protect, authorize('Admin'), updateMarketNews).delete(protect, authorize('Admin'), deleteMarketNews).get(getMarketNew);

module.exports = router;
