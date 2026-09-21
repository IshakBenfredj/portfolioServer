const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    title : {
        type : String,
        required: true
    },
    details : {
        type : String,
        required: true,
    },
    image : {
        type : String,
        required: true
    },
})


const Service = mongoose.model('Service', serviceSchema);

module.exports = Service