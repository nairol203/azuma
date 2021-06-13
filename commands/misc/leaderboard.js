const { MessageEmbed } = require('discord.js');
const { fetchLeaderboard, computeLeaderboard } = require('../../events/levels');

module.exports = {
	description: 'Zeigt die Rangliste des Servers an',
	callback: async ({ client, interaction }) => {
		const guildId = interaction.guildID;
		const guild = client.guilds.cache.get(guildId);

		const rawLeaderboard = await fetchLeaderboard(guildId, 10);

		if (rawLeaderboard.length < 1) return interaction.reply({ content: 'Aktuell ist hat noch niemand XP gesammelt.', ephemeral: true });

		const leaderboard = await computeLeaderboard(client, rawLeaderboard, true);

		const lb = leaderboard.map(e => `\`${e.position}.\` **${e.username}:**\nLevel: ${e.level} • XP: ${e.xp.toLocaleString()}`);

		const embed = new MessageEmbed()
			.setTitle(`Leaderboard von ${guild.name}`)
			.setDescription(`${lb.join('\n\n')}`)
			.setColor('f77600')
			.setThumbnail(`${guild.iconURL()}`)
            .setFooter('Azuma | Contact @florian#0002 for help.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);;
		interaction.reply({ embeds: [embed] });
	},
};