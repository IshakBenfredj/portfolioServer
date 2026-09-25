const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      enum: ["meet", "whatsapp", "telegram"],
      default: "meet",
    },
    topicCategory: {
      type: String,
      enum: [
        "new_project",
        "cahier_charges",
        "architecture_review",
        "technical_consulting",
        "mobile_app",
        "other",
      ],
      default: "new_project",
    },
    topicDetails: {
      type: String,
      required: true,
      trim: true,
    },
    projectBudget: {
      type: String,
      default: "",
    },
    preferredDate: {
      type: String,
      required: true,
    },
    preferredTimeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending",
    },
    meetingLink: {
      type: String,
      default: "",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
