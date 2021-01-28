const profileSchema = require('../schemas/profile-schema');

const coinsCache = {};

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

	coinsCache[`${userId}`] = result.coins;

	return result.coins;
};

module.exports.getCoins = async (userId) => {
	const cachedValue = coinsCache[`${userId}`];
	if (cachedValue) {
		return cachedValue;
	}

	const result = await profileSchema.findOne({
		userId,
	});

	let coins = 0;
	if (result) {
		coins = result.coins;
	}
	else {
		await new profileSchema({
			userId,
			coins,
		}).save();
	}

	coinsCache[`${userId}`] = coins;

	return coins;
};

module.exports.config = {
	displayName: 'Economy',
	dbName: 'ECONOMY',
};