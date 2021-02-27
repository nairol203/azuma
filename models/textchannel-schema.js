const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const textChannelSchema = mongoose.Schema({
	guildId: reqString,
	userId: reqString,
	channelId: reqString,
});

module.exports = mongoose.model('textchannel-schema', textChannelSchema);