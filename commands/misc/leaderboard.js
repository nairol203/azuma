const { MessageEmbed } = require('discord.js');
const { fetchLeaderboard, computeLeaderboard } = require('../../events/levels');

module.exports = {
	description: 'Zeigt die Rangliste des Servers an',
	callback: async ({ client, interaction }) => {
		await interaction.defer();
		const rawLeaderboard = await fetchLeaderboard(10);
		const leaderboard = await computeLeaderboard(client, rawLeaderboard, true);
		const lb = leaderboard.slice(0, 5).map(e => `\`${e.position}.\` **${e.username}#${e.discriminator}**\nLevel: ${e.level} • XP: ${e.xp.toLocaleString()}`);
		const embed = new MessageEmbed()
			.setTitle(`Leaderboard von ${client.user.username}`)
			.setDescription(`${lb.join('\n\n')}`)
			.setColor('f77600')
			.setThumbnail(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setFooter('Azuma | Contact @florian#0002 for help.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);;
		interaction.editReply({ embeds: [embed] });
	},
};