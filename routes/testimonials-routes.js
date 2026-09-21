const express = require("express");
const { getTestimonials, addTestimonial, deleteTestimonial } = require("../controllers/testimonials-controller.js");

const router = express.Router()

router.get('', getTestimonials)
router.post('/add', addTestimonial)
router.delete('/delete/:id', deleteTestimonial)

module.exports = router;