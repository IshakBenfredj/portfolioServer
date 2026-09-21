const Order = require('../models/order');
const Product = require('../models/product');

// POST add new order (from client)
const addOrder = async (req, res) => {
  try {
    const {
      productId,
      productTitle,
      price,
      clientName,
      clientPhone,
      clientEmail,
      clientNotes,
    } = req.body;

    if (!productTitle || !clientName || !clientPhone) {
      return res.status(400).json({ message: "Product title, client name, and phone are required" });
    }

    const newOrder = new Order({
      productId: productId || "",
      productTitle,
      price: price || "",
      clientName,
      clientPhone,
      clientEmail: clientEmail || "",
      clientNotes: clientNotes || "",
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    // Increment ordersCount on product if productId provided
    if (productId) {
      try {
        await Product.findByIdAndUpdate(productId, { $inc: { ordersCount: 1 } });
      } catch (err) {
        // Ignore if productId is not a valid ObjectId
      }
    }

    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

// GET all orders (for admin dashboard)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// PUT update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

// DELETE order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};

module.exports = {
  addOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
};
