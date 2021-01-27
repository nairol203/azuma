const Levels = require('discord-xp');
const Discord = require('discord.js');

module.exports = {
	aliases: 'lb',
	callback: async ({ client, message }) => {
		const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);

		if (rawLeaderboard.length < 1) return message.reply('Aktuell ist hat noch niemand XP gesammelt.');

		const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);

		const lb = leaderboard.map(e => `\`${e.position}.\` **${e.username}:**\nLevel: ${e.level} • XP: ${e.xp.toLocaleString()}`);

		const embed = new Discord.MessageEmbed()
			.setTitle(`Leaderboard von ${message.guild.name}`)
			.setDescription(`${lb.join('\n\n')}`)
			.setColor('f77600')
			.setThumbnail(`${message.guild.iconURL()}`);
		message.channel.send(embed);
	},
};