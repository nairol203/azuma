const Levels = require('discord-xp');
const cooldowns = new Set();
const Discord = require('discord.js');

const prefix = process.env.PREFIX;
Levels.setURL(process.env.MONGO_URI);

module.exports = (client) => {
	client.on('message', async message => {
		if ((!message.guild) || (message.author.bot)) return;

		if (message.content === (`${prefix}leaderboard`) || message.content === (`${prefix}lb`)) {
			const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);

			if (rawLeaderboard.length < 1) return message.reply('Aktuell ist hat noch niemand XP gesammelt.');

			const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);

			const lb = leaderboard.map(e => `\`${e.position}.\` **${e.username}#${e.discriminator}:**\nLevel: ${e.level} • XP: ${e.xp.toLocaleString()}`);

			const embed = new Discord.MessageEmbed()
				.setTitle(`Leaderboard von ${message.guild.name}`)
				.setDescription(`${lb.join('\n\n')}`)
				.setColor('f77600')
				.setThumbnail(`${message.guild.iconURL()}`);
			message.channel.send(embed);
		}

		if (cooldowns.has(message.author.id)) return;

		cooldowns.add(message.author.id);

		setTimeout(() => cooldowns.delete(message.author.id), 60000);

		const randomXp = Math.floor(Math.random() * 10) + 15;
		const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
		const user = await Levels.fetch(message.author.id, message.guild.id);
		if (hasLeveledUp) {
			if (message.guild.id === '255741114273759232') {
				const channel1 = client.channels.cache.find(channel => channel.id === '800036089078874132');
				channel1.send(`${message.author} ist jetzt Level ${user.level}!`);
			}
			else {message.reply(`du bist jetzt Level ${user.level}!`);}
		}

		// Level Rewards
		const lvl1 = message.guild.roles.cache.find(role => role.name === 'Level 1');
		if (user.level <= 4) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl1);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl1);
		}
		const lvl5 = message.guild.roles.cache.find(role => role.name === 'Level 5');
		if (user.level >= 5 & user.level <= 9) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl5);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl5);
		}
		const lvl10 = message.guild.roles.cache.find(role => role.name === 'Level 10');
		if (user.level >= 10 & user.level <= 14) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl10);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl10);
		}

		const lvl15 = message.guild.roles.cache.find(role => role.name === 'Level 15');
		if (user.level >= 15 & user.level <= 19) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl15);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl15);
		}
		const lvl20 = message.guild.roles.cache.find(role => role.name === 'Level 20');
		if (user.level >= 20 & user.level <= 24) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl20);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl20);
		}
		const lvl30 = message.guild.roles.cache.find(role => role.name === 'Level 30');
		if (user.level >= 30 & user.level <= 39) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl30);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl30);
		}
		const lvl40 = message.guild.roles.cache.find(role => role.name === 'Level 40');
		if (user.level >= 40 & user.level <= 49) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl40);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl40);
		}
		const lvl50 = message.guild.roles.cache.find(role => role.name === 'Level 50');
		if (user.level >= 50 & user.level <= 59) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl50);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl50);
		}
		const lvl60 = message.guild.roles.cache.find(role => role.name === 'Level 60');
		if (user.level >= 60 & user.level <= 69) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl60);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl60);
		}
		const lvl70 = message.guild.roles.cache.find(role => role.name === 'Level 70');
		if (user.level >= 70 & user.level <= 79) {
			message.guild.members.cache.get(message.author.id).roles.add(lvl70);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(lvl70);
		}
	});
};