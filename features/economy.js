const profileSchema = require('../models/profile');

const coinsCache = {};

module.exports.addCoins = async (guildId, userId, coins) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			guildId,
			userId,
		},
		{
			guildId,
			userId,
			$inc: {
				coins,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	coinsCache[`${userId}`] = result.coins;

	return result.coins;
};

module.exports.getCoins = async (guildId, userId) => {
	const cachedValue = coinsCache[`${guildId, userId}`];
	if (cachedValue) {
		return cachedValue;
	}

	const result = await profileSchema.findOne({
		guildId,
		userId,
	});

	let coins = 0;
	if (result) {
		coins = result.coins;
	}
	else {
		await new profileSchema({
			guildId,
			userId,
			coins,
		}).save();
	}

	coinsCache[`${guildId, userId}`] = coins;

	return coins;
};