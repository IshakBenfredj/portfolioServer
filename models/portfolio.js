const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    title : {
        type : String,
        required: true
    },
    link : {
        type : String,
        required: true
    },
    type : {
        type : String,
        required: true,
    },
    details : {
        type : String,
        required: true,
    },
    image : {
        type : String,
        required: true
    },
    views : {
        type : Number,
        default: 0
    },
},{timestamps: true})

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio