const express = require("express");
const {
  getProducts,
  getProductById,
  addProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/product-controller");

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/add', addProduct);
router.put('/edit/:id', editProduct);
router.put('/update/:id', editProduct);
router.patch('/update/:id', editProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
