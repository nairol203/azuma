const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const reqBoolean = {
	type: Boolean,
	required: false,
};

const business = mongoose.Schema({
	userId: reqString,
	type: reqString,
	upgrade1: reqBoolean,
	upgrade2: reqBoolean,
	upgrade3: reqBoolean,
});

module.exports = mongoose.model('business', business);