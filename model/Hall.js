const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallSchema = new Schema({
    hallname: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    ac: {
        type: Boolean,
        default:false,
        required: true
    },
    projector: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Hall', hallSchema);