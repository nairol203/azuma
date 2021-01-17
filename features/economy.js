const mongo = require('../mongo');
const profileSchema = require('../schemas/profile-schema');

const coinsCache = {};

module.exports.addCoins = async (userId, coins) => {
	return await mongo().then(async (mongoose) => {
		try {
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
		}
		finally {
			mongoose.connection.close();
		}
	});
};

module.exports.getCoins = async (userId) => {
	const cachedValue = coinsCache[`${userId}`];
	if (cachedValue) {
		return cachedValue;
	}

	return await mongo().then(async (mongoose) => {
		try {
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
		}
		finally {
			mongoose.connection.close();
		}
	});
};