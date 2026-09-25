const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoriesByType,
  addCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
} = require('../controllers/category-controller');

// Seed default categories
router.post('/seed', seedCategories);

// Get all categories or ?type=
router.get('/', getAllCategories);

// Get categories by specific type (skills, products, lessons, portfolio)
router.get('/type/:type', getCategoriesByType);
router.get('/:type', (req, res, next) => {
  // If param matches one of the known section types, route to getCategoriesByType
  if (['skills', 'products', 'lessons', 'portfolio'].includes(req.params.type)) {
    return getCategoriesByType(req, res);
  }
  next();
});

// Add new category
router.post('/add', addCategory);

// Update category
router.put('/edit/:id', updateCategory);
router.patch('/edit/:id', updateCategory);

// Delete category
router.delete('/delete/:id', deleteCategory);

module.exports = router;
