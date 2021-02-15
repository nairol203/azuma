const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const customs = mongoose.Schema({
	channelId: reqString,
});

module.exports = mongoose.model('customs', customs);