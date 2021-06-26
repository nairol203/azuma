const { MessageEmbed } = require('discord.js');
const { fetchXP, computeXP, fetchCredits, computeCredits } = require('../../features/leaderboard');

module.exports = {
	description: 'Zeigt die Rangliste des Servers an',
	options: [
		{
			name: 'type',
			description: 'Wähle ein Leaderboard aus.',
			choices: [
				{
					name: 'XP',
					value: 'xp',
				},
				{
					name: 'Credits',
					value: 'credits',
				},
			],
			required: true,
			type: 3,
		},
	],
	callback: async ({ client, interaction }) => {
		const type = interaction.options.get('type').value;
		await interaction.defer();
		if (type == 'xp') {
			const rawLeaderboard = await fetchXP(10);
			const leaderboard = await computeXP(client, rawLeaderboard, true);
			const lb = leaderboard.slice(0, 5).map(e => `\`${e.position}.\` **${e.username}#${e.discriminator}**\nLevel: ${e.level} • XP: ${e.xp.toLocaleString()}`);
			const embed = new MessageEmbed()
				.setTitle(`XP-Leaderboard von ${client.user.username}`)
				.setDescription(`${lb.join('\n\n')}`)
				.setColor('f77600')
				.setThumbnail(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
				.setFooter('Azuma | Contact @florian#0002 for help.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);;
			interaction.editReply({ embeds: [embed] });
		}
		else if (type == 'credits') {
			const rawLeaderboard = await fetchCredits(10);
			const leaderboard = await computeCredits(client, rawLeaderboard, true);
			const lb = leaderboard.slice(0, 5).map(e => `\`${e.position}.\` **${e.username}#${e.discriminator}**\nLevel: ${e.level} • XP: ${e.coins.toLocaleString()}`);
			const embed = new MessageEmbed()
				.setTitle(`Credits-Leaderboard von ${client.user.username}`)
				.setDescription(`${lb.join('\n\n')}`)
				.setColor('f77600')
				.setThumbnail(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
				.setFooter('Azuma | Contact @florian#0002 for help.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);;
			interaction.editReply({ embeds: [embed] });
		}
	},
};