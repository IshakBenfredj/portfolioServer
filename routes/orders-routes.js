const express = require("express");
const {
  addOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order-controller");

const router = express.Router();

router.post('/add', addOrder);
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);
router.delete('/delete/:id', deleteOrder);

module.exports = router;
