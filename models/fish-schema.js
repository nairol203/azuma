const mongoose = require('mongoose');

const reqString = {
	type: Number,
	default: 0,
};

const profileSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	common: reqString,
	uncommon: reqString,
	rare: reqString,
	garbage: reqString,

});

module.exports = mongoose.model('fishstats', profileSchema);