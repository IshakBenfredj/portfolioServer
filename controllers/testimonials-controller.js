const Testimonial = require('../models/testimonial');

const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(201).json(testimonials);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const addTestimonial = async (req, res) => {
    try {
        const { name, text, gender } = req.body;
        const testimonial = await Testimonial.create({ name, text, gender });
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        await Testimonial.findByIdAndDelete(id);
        res.status(201).json({ message: 'ok' });
    } catch (error) {
        res.status(500).json({ error: 'problem' });
    }
};

module.exports = {
    getTestimonials,
    addTestimonial,
    deleteTestimonial,
};