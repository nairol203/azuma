const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const reqNumber = {
    type: Number,
    required: true,
};

const profileSchema = mongoose.Schema({
	userId: reqString,
	coins: {
		type: Number,
		default: 0,
	},
	xp: {
		type: Number,
		default: 0,
	},
	level: {
		type: Number,
		default: 1,
	},
    rod: reqString,
    bag: reqString,
    bag_size: reqNumber,
    bag_value: reqNumber,
    active_bait: reqString,
});

module.exports = mongoose.model('profiles', profileSchema);