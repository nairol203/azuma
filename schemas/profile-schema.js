const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
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
});

module.exports = mongoose.model('profiles', profileSchema);