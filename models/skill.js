const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    name : {
        type : String,
        required: true
    },
    type : {
        type : Array,
        required: true,
        default: [],
    },
    image : {
        type : String,
        required: true
    },
})


const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill