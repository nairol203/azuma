const profileSchema = require('../models/profile');
const cooldowns = new Set();

module.exports = {
	name: 'message',
	async run(message, client) {
		if ((!message.guild) || (message.author.bot)) return;

		await roleLevels(message);

		if (cooldowns.has(message.author.id)) return;
		cooldowns.add(message.author.id);
		setTimeout(() => cooldowns.delete(message.author.id), 60000);


		const randomXp = Math.floor(Math.random() * (25 - 15 + 1) + 15);
		addXP(message.guild.id, message.member.id, randomXp, message, client);
	},
};

const getNeededXP = (level) => 1.72 * Math.pow(level, 3) + 22.29 * Math.pow(level, 2) + 121.11 * level - 45.12;

module.exports.getNeededXP = getNeededXP;

async function addXP(guildId, userId, xpToAdd, message, client) {
	const result = await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
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
		const guild = client.guilds.cache.get(guildId);
		const levelupChannel = guild.channels.cache.find(channel => channel.id === '802523905512046602');

		if (levelupChannel !== undefined) {
			levelupChannel.send(`${message.member} ist jetzt Level ${level}!`);
		}
		else {
			message.reply(`du bist jetzt Level ${level}!`);
		}

		await profileSchema.updateOne(
			{
				userId,
			},
			{
				level,
			},
		);
	}
}

async function roleLevels(message) {
	const userId = message.member.id;

	const user = await profileSchema.findOne(
		{
			userId,
		},
	);

	if (user === null) return;

	const lvl1 = message.guild.roles.cache.find(role => role.name === 'Level 1');
	if (lvl1 === undefined) return;
	if (user.level <= 4) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl1);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl1);
	}
	const lvl5 = message.guild.roles.cache.find(role => role.name === 'Level 5');
	if (lvl5 === undefined) return;
	if (user.level >= 5 & user.level <= 9) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl5);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl5);
	}
	const lvl10 = message.guild.roles.cache.find(role => role.name === 'Level 10');
	if (lvl10 === undefined) return;
	if (user.level >= 10 & user.level <= 14) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl10);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl10);
	}

	const lvl15 = message.guild.roles.cache.find(role => role.name === 'Level 15');
	if (lvl15 === undefined) return;
	if (user.level >= 15 & user.level <= 19) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl15);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl15);
	}
	const lvl20 = message.guild.roles.cache.find(role => role.name === 'Level 20');
	if (lvl20 === undefined) return;
	if (user.level >= 20 & user.level <= 24) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl20);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl20);
	}
	const lvl30 = message.guild.roles.cache.find(role => role.name === 'Level 30');
	if (lvl30 === undefined) return;
	if (user.level >= 30 & user.level <= 39) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl30);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl30);
	}
	const lvl40 = message.guild.roles.cache.find(role => role.name === 'Level 40');
	if (lvl40 === undefined) return;
	if (user.level >= 40 & user.level <= 49) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl40);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl40);
	}
	const lvl50 = message.guild.roles.cache.find(role => role.name === 'Level 50');
	if (lvl50 === undefined) return;
	if (user.level >= 50 & user.level <= 59) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl50);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl50);
	}
	const lvl60 = message.guild.roles.cache.find(role => role.name === 'Level 60');
	if (lvl60 === undefined) return;
	if (user.level >= 60 & user.level <= 69) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl60);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl60);
	}
	const lvl70 = message.guild.roles.cache.find(role => role.name === 'Level 70');
	if (lvl70 === undefined) return;
	if (user.level >= 70 & user.level <= 79) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl70);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl70);
	}
	const lvl80 = message.guild.roles.cache.find(role => role.name === 'Level 80');
	if (lvl80 === undefined) return;
	if (user.level >= 80 & user.level <= 89) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl80);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl80);
	}
	const lvl90 = message.guild.roles.cache.find(role => role.name === 'Level 90');
	if (lvl90 === undefined) return;
	if (user.level >= 90 & user.level <= 99) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl90);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl90);
	}
	const lvl100 = message.guild.roles.cache.find(role => role.name === 'Level 100');
	if (lvl100 === undefined) return;
	if (user.level >= 100) {
		message.guild.members.cache.get(message.author.id).roles.add(lvl100);
	}
	else {
		message.guild.members.cache.get(message.author.id).roles.remove(lvl100);
	}
}