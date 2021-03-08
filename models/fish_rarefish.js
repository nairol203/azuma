const mongoose = require('mongoose');

const reqBoolean = {
	type: Boolean,
	required: false,
};

const rarefishSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	penguin: reqBoolean,
	turtle: reqBoolean,
	octopus: reqBoolean,
	squid: reqBoolean,
	shrimp: reqBoolean,
	crab: reqBoolean,
	blowfish: reqBoolean,
	dolphin: reqBoolean,
	whale: reqBoolean,
	whale2: reqBoolean,
	shark: reqBoolean,
	crocodile: reqBoolean,
});

module.exports = mongoose.model('rarefish', rarefishSchema);