const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    date:{
        type:Date,
        required:true,
    }
    
});

module.exports = mongoose.model('Feedback', feedbackSchema);