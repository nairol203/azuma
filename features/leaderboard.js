// Credits Leaderboard

module.exports.fetchCredits = async (limit) => {
	const users = await profileSchema.find().sort([['coins', 'descending']]).exec();
	return users.slice(0, limit);
};

module.exports.computeCredits = async (client, leaderboard, fetchUsers = false) => {
	if (leaderboard.length < 1) return [];
	const computedArray = [];
	if (fetchUsers) {
		for (const key of leaderboard) {
			const user = await client.users.fetch(key.userId) || { username: 'Unknown', discriminator: '000' };
			computedArray.push({
				userId: key.userId,
				coins: key.coins,
				level: key.level,
				position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
				username: user.username,
				discriminator: user.discriminator,
			});
		}
	}
	else {
		leaderboard.map(key => computedArray.push({
			userId: key.userId,
			coins: key.coins,
			level: key.level,
			position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
			username: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).username : 'Unknown',
			discriminator: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).discriminator : '0000',
		}));
	}
	return computedArray;
};

// XP Leaderboard

module.exports.fetchXP = async (limit) => {
	const users = await profileSchema.find().sort([['xp', 'descending']]).exec();
	return users.slice(0, limit);
};

module.exports.computeXP = async (client, leaderboard, fetchUsers = false) => {
	if (leaderboard.length < 1) return [];
	const computedArray = [];
	if (fetchUsers) {
		for (const key of leaderboard) {
			const user = await client.users.fetch(key.userId) || { username: 'Unknown', discriminator: '000' };
			computedArray.push({
				userId: key.userId,
				xp: key.xp,
				level: key.level,
				position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
				username: user.username,
				discriminator: user.discriminator,
			});
		}
	}
	else {
		leaderboard.map(key => computedArray.push({
			userId: key.userId,
			xp: key.xp,
			level: key.level,
			position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
			username: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).username : 'Unknown',
			discriminator: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).discriminator : '0000',
		}));
	}
	return computedArray;
}