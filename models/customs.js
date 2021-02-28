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
	jukeboxId: opString,
	args1: opString,
	args2: opString,
	args3: opString,
	args4: opString,
	args5: opString,
});

module.exports = mongoose.model('customs', customs);