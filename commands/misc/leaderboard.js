const { MessageEmbed } = require('discord.js');
const Levels = require('../../events/levels');

module.exports = {
	description: 'Zeigt die Rangliste des Servers an',
	callback: async ({ client, interaction }) => {
		const guildId = interaction.guild_id;
		const guild = client.guilds.cache.get(guildId);

		const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10);

		if (rawLeaderboard.length < 1) return 'Aktuell ist hat noch niemand XP gesammelt.';

		const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);

		const lb = leaderboard.map(e => `\`${e.position}.\` **${e.username}:**\nLevel: ${e.level} • XP: ${e.xp.toLocaleString()}`);

		const embed = new MessageEmbed()
			.setTitle(`Leaderboard von ${guild.name}`)
			.setDescription(`${lb.join('\n\n')}`)
			.setColor('f77600')
			.setThumbnail(`${guild.iconURL()}`)
            .setFooter('Azuma | Contact @florian#0002 for help.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);;
		return embed;
	},
};