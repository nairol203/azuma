const mongoose = require('mongoose');

const fishModel = mongoose.Schema({
	userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('garbage', fishModel);