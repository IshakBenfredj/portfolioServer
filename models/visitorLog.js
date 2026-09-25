const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitorLogSchema = new Schema({
  ipHash: {
    type: String,
    required: true,
    index: true,
  },
  rawIp: {
    type: String,
    default: "127.0.0.1",
    index: true,
  },
  deviceName: {
    type: String,
    default: "PC Desktop",
  },
  path: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: "",
  },
  entityType: {
    type: String,
    default: "general", // 'portfolio', 'product', 'service', 'lesson', 'general'
  },
  entityId: {
    type: String,
    default: null,
  },
  referrer: {
    type: String,
    default: "direct",
  },
  device: {
    type: String, // 'desktop', 'mobile', 'tablet'
    default: "desktop",
  },
  browser: {
    type: String, // 'Chrome', 'Firefox', 'Safari', 'Edge', 'Other'
    default: "Other",
  },
  os: {
    type: String, // 'Windows', 'MacOS', 'Linux', 'Android', 'iOS', 'Other'
    default: "Other",
  },
  country: {
    type: String,
    default: "Algeria",
  },
  countryCode: {
    type: String,
    default: "DZ",
  },
  city: {
    type: String,
    default: "",
  },
  isBlocked: {
    type: Boolean,
    default: false,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Index for fast analytics queries
visitorLogSchema.index({ timestamp: -1 });
visitorLogSchema.index({ path: 1, timestamp: -1 });
visitorLogSchema.index({ ipHash: 1, timestamp: -1 });

const VisitorLog = mongoose.model("VisitorLog", visitorLogSchema);

module.exports = VisitorLog;
