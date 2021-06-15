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
	callback: async ({ interaction }) => {
		const userId = interaction?.options?.get('user')?.value || interaction.member.user.id;
		const credits = await economy.getCoins(userId);
		interaction.reply(`💵  |  **<@${userId}>**, du hast aktuell **${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(credits)}** Credits.`);
	},
};
