const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewInviteSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    default: "",
  },
  clientPhone: {
    type: String,
    default: "",
  },
  projectName: {
    type: String,
    required: true,
  },
  projectCategory: {
    type: String,
    default: "تطوير تطبيقات ومواقع الويب",
  },
  isUsed: {
    type: Boolean,
    default: false,
    index: true,
  },
  usedAt: {
    type: Date,
    default: null,
  },
  createdTestimonialId: {
    type: Schema.Types.ObjectId,
    ref: "Testimonial",
    default: null,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewInvite = mongoose.model("ReviewInvite", reviewInviteSchema);

module.exports = ReviewInvite;
