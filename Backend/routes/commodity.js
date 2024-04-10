const express = require("express");
const {
  addCommodity,
  getCommodities,
  getCommodity,
  updateCommodity,
  deleteCommodity,
} = require("../controllers/commodity");
const { protect, authorize  } = require("../middleware/auth");
const Commodity = require('../models/Commodity');
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").post(protect, authorize('Admin'), addCommodity).get(advancedResults(Commodity), getCommodities);
router.route("/:id").put(protect, authorize('Admin'), updateCommodity).delete(protect, authorize('Admin'), deleteCommodity).get(getCommodity);

module.exports = router;
