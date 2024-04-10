const express = require("express");
const {
  addConfiguration,
  getConfigurations,
  getConfiguration,
  deleteConfiguration,
  getAlert,
  getReporting,
  updateConfiguration,
  getPriceChangeByMonth,
  getTotalPendingPriceUpdates,
  getTotalConfigurations,
} = require("../controllers/configuration");
const { protect, authorize  } = require("../middleware/auth");
const Configuration = require('../models/Configuration');
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/TotalPendingPriceUpdate").get(protect, authorize('Admin'), getTotalPendingPriceUpdates);
router.route("/TotalConfiguration").get(protect, authorize('Admin'), getTotalConfigurations);
router.route("/").post(protect, authorize('Admin'), addConfiguration).get(advancedResults(Configuration), getConfigurations);
router.route("/:id").put(protect, authorize('Admin'), updateConfiguration).delete(protect, authorize('Admin'), deleteConfiguration).get(getConfiguration);
router.route("/getPriceChangeByMonth").get(getPriceChangeByMonth);
router.route("/get/alert").get(protect, getAlert);
router.route("/reporting/config").get(protect, getReporting);
module.exports = router;
