const { MessageEmbed } = require('discord.js');
const Levels = require('../../features/levels');

module.exports = {
	slash: true,
	aliases: 'lb',
	callback: async ({ client, interaction }) => {
		const guildId = interaction.guild_id;
		const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10);

		if (rawLeaderboard.length < 1) return 'Aktuell ist hat noch niemand XP gesammelt.';

		const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);

		const lb = leaderboard.map(e => `\`${e.position}.\` **${e.username}:**\nLevel: ${e.level} • XP: ${e.xp.toLocaleString()}`);

		const embed = new MessageEmbed()
			.setTitle(`Leaderboard von ${message.guild.name}`)
			.setDescription(`${lb.join('\n\n')}`)
			.setColor('f77600')
			.setThumbnail(`${message.guild.iconURL()}`);
		return embed;
	},
};