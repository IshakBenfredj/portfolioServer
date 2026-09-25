const express = require("express");
const {
  trackVisit,
  getAnalyticsSummary,
  getVisitorsList,
  toggleBlockVisitor,
  deleteVisitorLogs,
  clearAllLogs,
} = require("../controllers/analytics-controller");

const router = express.Router();

// Public route for client tracking
router.post("/track", trackVisit);

// Admin routes for analytics and visitors list
router.get("/summary", getAnalyticsSummary);
router.get("/visitors", getVisitorsList);
router.put("/toggle-block/:ipHash", toggleBlockVisitor);
router.delete("/visitor/:ipHash", deleteVisitorLogs);
router.delete("/clear-all", clearAllLogs);

module.exports = router;
