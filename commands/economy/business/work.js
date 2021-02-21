const economy = require('../../../features/economy');
const business = require('../../../features/business');

module.exports = {
	// cooldown: '8h',
	callback: async ({ message }) => {
		const { author, guild, channel } = message;
		const guildId = guild.id;
		const userId = author.id;

		const company = await business.setCompany(guildId, userId);
		const profit = await business.checkProfit(guildId, userId);

		// await economy.addCoins(guildId, userId, profit);
		channel.send(`Du hast die hergestellte Ware von deiner ${company.name} verkauft und hast dabei ${profit} Coins erwirtschaftet!`);
	},
};