const mongoose = require('mongoose');

const string = {
    type: String,
};


const reqString = {
    type: String,
    required: true,
};

const number = {
    type: Number,
};

const profileSchema = mongoose.Schema({
	guildId: reqString,
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
    rod: string,
    bag: string,
    bag_size: number,
    bag_value: number,
    active_bait: string,
});

module.exports = mongoose.model('profiles', profileSchema);