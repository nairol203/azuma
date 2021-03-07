const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const reqNumber = {
	type: Number,
	required: false,
};

const cooldowns = mongoose.Schema({
	userId: reqString,
	command: reqString,
	cooldown: reqNumber,
});

module.exports = mongoose.model('cooldowns', cooldowns);