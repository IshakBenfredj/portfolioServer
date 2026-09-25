const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testimonialSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'عميل / شريك عمل',
        trim: true
    },
    company: {
        type: String,
        default: '',
        trim: true
    },
    projectTitle: {
        type: String,
        default: '',
        trim: true
    },
    text: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    },
    gender: {
        type: String,
        default: 'male'
    },
    image: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false,
        index: true
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    inviteToken: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;