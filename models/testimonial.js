const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testimonialSchema = new Schema({
    name : {
        type : String,
        required: true
    },
    text : {
        type : String,
        required: true,
    },
    gender : {
        type : String,
        required: true
    },
})


const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial