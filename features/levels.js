const profileSchema = require('../schemas/profile-schema');
const cooldowns = new Set();


module.exports = (client) => {
	client.on('message', (message) => {
		if(message.author.bot) return;

		if (cooldowns.has(message.author.id)) return;
		cooldowns.add(message.author.id);
		setTimeout(() => cooldowns.delete(message.author.id), 60000);


		const randomXp = Math.floor(Math.random() * (25 - 15 + 1) + 15);
		addXP(message.guild.id, message.member.id, randomXp, message, client);
	});
};

const getNeededXP = (level) => 1.72 * Math.pow(level, 3) + 22.29 * Math.pow(level, 2) + 121.11 * level - 45.12;

const addXP = async (guildId, userId, xpToAdd, message, client) => {
	const result = await profileSchema.findOneAndUpdate(
		{
			guildId,
			userId,
		},
		{
			guildId,
			userId,
			$inc: {
				xp: xpToAdd,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	let { xp, level } = result;
	const needed = getNeededXP(level);

	if (xp >= needed) {
		++level;
		xp -= needed;
		const levelupChannel = client.channels.cache.find(channel => channel.id === '800036089078874132');
		levelupChannel.send(`${message.member} ist jetzt Level ${level}!`);

		await profileSchema.updateOne(
			{
				guildId,
				userId,
			},
			{
				level,
			},
		);
	}
};

const fetchLeaderboard = async (guildId, limit) => {
	if (!guildId) throw new TypeError('A guild id was not provided.');
	if (!limit) throw new TypeError('A limit was not provided.');

	const users = await profileSchema.find({ guildId: guildId }).sort([['xp', 'descending']]).exec();

	return users.slice(0, limit);
};

const computeLeaderboard = async (client, leaderboard, fetchUsers = false) => {
	if (!client) throw new TypeError('A client was not provided.');
	if (!leaderboard) throw new TypeError('A leaderboard id was not provided.');

	if (leaderboard.length < 1) return [];

	const computedArray = [];

	if (fetchUsers) {
		for (const key of leaderboard) {
			const user = await client.users.fetch(key.userId) || { username: 'Unknown', discriminator: '000' };
			computedArray.push({
				guildId: key.guildId,
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
			guildId: key.guildId,
			userId: key.userId,
			xp: key.xp,
			level: key.level,
			position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
			username: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).username : 'Unknown',
			discriminator: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).discriminator : '0000',
		}));
	}

	return computedArray;
};

module.exports.fetchLeaderboard = fetchLeaderboard;
module.exports.computeLeaderboard = computeLeaderboard;

module.exports.getNeededXP = getNeededXP;