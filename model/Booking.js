const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    hallid: {
        type: ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {       
            type: Date,
            required:true
    },
    starttime: {
        type: Date,
        required: true
    },
    endtime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
