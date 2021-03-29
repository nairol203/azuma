const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const reqNumber = {
    type: Number,
    required: true,
};

const profileSchema = mongoose.Schema({
	userId: reqString,
    rod: reqString,
    bag: reqString,
    bag_size: reqNumber,
    bag_value: reqNumber,
    bait_1: reqNumber,
    bait_2: reqNumber,
    bait_3: reqNumber,
    active_bait: reqString,
});

module.exports = mongoose.model('fish-profiles', profileSchema);