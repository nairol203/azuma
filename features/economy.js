const profileSchema = require('../models/profile');

module.exports.addCoins = async (userId, coins) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
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

module.exports.getCoins = async (userId) => {
	const result = await profileSchema.findOne({
		userId,
	});
	return result.coins;
};