const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const opString = {
	type: String,
	required: false,
};

const customs = mongoose.Schema({
	userId: reqString,
	channelId: reqString,
	channelName: opString,
	channelLimit: opString,
	textChannelId: opString,
});

module.exports = mongoose.model('customs', customs);