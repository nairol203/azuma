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

		return `💵  |  **${interaction.member.nick}**, du hast aktuell **${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(credits)}** Credits.`

		// const target = message.mentions.users.first() || message.author;
		// if (target.bot) return;

		// const guildId = message.guild.id;
		// const userId = target.id;

		// const coins = await economy.getCoins(guildId, userId);

		// message.channel.send(`💵  |  **${target.username}**, du hast aktuell **${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(coins)}** Credits.`);
	},
};
