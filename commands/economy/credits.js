const economy = require('../../features/economy');

module.exports = {
	slash: true,
	aliases: ['coins'],
	maxArgs: 1,
	expectedArgs: '<user>',
	callback: async ({ args, interaction }) => {
		const user = interaction.member.user;
		const userId = args.user || user.id;
		const guildId = interaction.guild_id;

		const credits = await economy.getCoins(guildId, userId);

		return `💵  |  **${user.username}**, du hast aktuell **${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(credits)}** Credits.`
	},
};
