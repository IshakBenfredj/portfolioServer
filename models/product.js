const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionItemSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "check",
  },
}, { _id: false });

const sectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "sparkles",
  },
  description: {
    type: String,
    default: "",
  },
  items: [sectionItemSchema],
}, { _id: false });

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  oldPrice: {
    type: String,
    default: "",
    trim: true,
  },
  category: {
    type: String,
    default: "templates",
    trim: true,
  },
  shortDesc: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  images: [{
    type: String,
  }],
  demoUrl: {
    type: String,
    default: "",
  },
  sections: [sectionSchema],
  tags: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ["ready", "comingSoon"],
    default: "ready",
  },
  views: {
    type: Number,
    default: 0,
  },
  ordersCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
