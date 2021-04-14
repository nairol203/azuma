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
	return result.coins;
};

module.exports.getCoins = async (guildId, userId) => {
	const result = await profileSchema.findOne({
		guildId,
		userId,
	});
	return result.coins;
};