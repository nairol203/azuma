const profileSchema = require('../models/fish_inv');

const commonCache = {};

module.exports.addCommon = async (userId, common) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			$inc: {
				common,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	commonCache[`${userId}`] = result.common;

	return result.common;
};
module.exports.getCommon = async (userId) => {
	const cachedValue = commonCache[`${userId}`];
	if (cachedValue) {
		return cachedValue;
	}

	const result = await profileSchema.findOne({
		userId,
	});

	let common = 0;
	if (result) {
		common = result.common;
	}
	else {
		await new profileSchema({
			userId,
			common,
		}).save();
	}

	commonCache[`${userId}`] = common;

	return common;
};
module.exports.setCommon = async (userId, common) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			$set: {
				common,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	commonCache[`${userId}`] = result.common;

	return result.common;
};


const uncommonCache = {};

module.exports.addUncommon = async (userId, uncommon) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			$inc: {
				uncommon,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	uncommonCache[`${userId}`] = result.uncommon;

	return result.uncommon;
};
module.exports.getUncommon = async (userId) => {
	const cachedValue = uncommonCache[`${userId}`];
	if (cachedValue) {
		return cachedValue;
	}

	const result = await profileSchema.findOne({
		userId,
	});

	let uncommon = 0;
	if (result) {
		uncommon = result.uncommon;
	}
	else {
		await new profileSchema({
			userId,
			uncommon,
		}).save();
	}

	uncommonCache[`${userId}`] = uncommon;

	return uncommon;
};
module.exports.setUncommon = async (userId, uncommon) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			$set: {
				uncommon,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	uncommonCache[`${userId}`] = result.uncommon;

	return result.uncommon;
};


const rareCache = {};

module.exports.addRare = async (userId, rare) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			$inc: {
				rare,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	rareCache[`${userId}`] = result.rare;

	return result.rare;
};
module.exports.getRare = async (userId) => {
	const cachedValue = rareCache[`${userId}`];
	if (cachedValue) {
		return cachedValue;
	}

	const result = await profileSchema.findOne({
		userId,
	});

	let rare = 0;
	if (result) {
		rare = result.rare;
	}
	else {
		await new profileSchema({
			userId,
			rare,
		}).save();
	}

	rareCache[`${userId}`] = rare;

	return rare;
};
module.exports.setRare = async (userId, rare) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			$set: {
				rare,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	rareCache[`${userId}`] = result.rare;

	return result.rare;
};


const garbageCache = {};

module.exports.addGarbage = async (userId, garbage) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			$inc: {
				garbage,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	garbageCache[`${userId}`] = result.garbage;

	return result.garbage;
};
module.exports.getGarbage = async (userId) => {
	const cachedValue = garbageCache[`${userId}`];
	if (cachedValue) {
		return cachedValue;
	}

	const result = await profileSchema.findOne({
		userId,
	});

	let garbage = 0;
	if (result) {
		garbage = result.garbage;
	}
	else {
		await new profileSchema({
			userId,
			garbage,
		}).save();
	}

	garbage[`${userId}`] = garbage;

	return garbage;
};
module.exports.setGarbage = async (userId, garbage) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			$set: {
				garbage,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	garbageCache[`${userId}`] = result.garbage;

	return result.garbage;
};