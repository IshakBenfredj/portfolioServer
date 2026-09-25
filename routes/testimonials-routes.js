const express = require("express");
const {
  getTestimonials,
  addTestimonial,
  deleteTestimonial,
  generateInvite,
  getInvites,
  deleteInvite,
  verifyToken,
  submitVerifiedReview,
} = require("../controllers/testimonials-controller.js");

const router = express.Router();

// Public routes
router.get("", getTestimonials);
router.get("/verify-token/:token", verifyToken);
router.post("/submit-verified", submitVerifiedReview);

// Admin / Management routes
router.post("/add", addTestimonial);
router.delete("/delete/:id", deleteTestimonial);
router.post("/generate-invite", generateInvite);
router.get("/invites", getInvites);
router.delete("/invites/:id", deleteInvite);

module.exports = router;