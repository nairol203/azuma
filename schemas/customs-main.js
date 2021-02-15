const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const customsMain = mongoose.Schema({
	channelId: reqString,
});

module.exports = mongoose.model('customs-main', customsMain);