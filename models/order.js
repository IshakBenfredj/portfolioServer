const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  productId: {
    type: String,
    default: "",
  },
  productTitle: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    default: "",
  },
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  clientPhone: {
    type: String,
    required: true,
    trim: true,
  },
  clientEmail: {
    type: String,
    default: "",
    trim: true,
  },
  clientNotes: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
