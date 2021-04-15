const economy = require('../../features/economy');

module.exports = {
	description: 'Fragt die Credits von dir oder einem anderen User ab!',
	options: [
		{
			name: 'user',
			description: 'Beliebiges Servermitglied',
			type: 6,
		}
	],
	callback: async ({ args, interaction }) => {
		const userId = args.user || interaction.member.user.id;
		const guildId = interaction.guild_id;
		const credits = await economy.getCoins(guildId, userId);
		return `💵  |  **<@${userId}>**, du hast aktuell **${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(credits)}** Credits.`
	},
};
