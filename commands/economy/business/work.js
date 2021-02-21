const economy = require('../../../features/economy');
const business = require('../../../features/business');

const documents = business.getInfo(1);
const weed = business.getInfo(2);
const fakeMoney = business.getInfo(3);
const meth = business.getInfo(4);
const cocaine = business.getInfo(5);
const upgrades = business.getInfo('upgrades');

module.exports = {
	cooldown: '8h',
	callback: async ({ message }) => {
		const { author, guild, channel } = message;
		const guildId = guild.id;
		const userId = author.id;

		const getBusiness = await business.getBusiness(guildId, userId);

		if (getBusiness === undefined) return channel.send('Du brauchst ein Unternehmen um zu arbeiten!');
		let company = [];
		if (getBusiness.type === 'Dokumentenfälscherei') company = documents;
		if (getBusiness.type === 'Handplantage') company = weed;
		if (getBusiness.type === 'Geldfälscherei') company = fakeMoney;
		if (getBusiness.type === 'Methproduktion') company = meth;
		if (getBusiness.type === 'Kokainproduktion') company = cocaine;

		const upgrade1 = company.profit * upgrades.upgrade1;
		const upgrade2 = company.profit * upgrades.upgrade2;
		const upgrade3 = company.profit * upgrades.upgrade3;

		let checkUpgrade1 = 0;
		if (getBusiness.upgrade1 === true) checkUpgrade1 = upgrade1;
		let checkUpgrade2 = 0;
		if (getBusiness.upgrade2 === true) checkUpgrade2 = upgrade2;
		let checkUpgrade3 = 0;
		if (getBusiness.upgrade3 === true) checkUpgrade3 = upgrade3;

		const profit = company.profit + checkUpgrade1 + checkUpgrade2 + checkUpgrade3;

		// await economy.addCoins(guildId, userId, profit);
		channel.send(`Du hast die hergestellte Ware von deiner ${company.name} verkauft und hast dabei ${profit} Coins erwirtschaftet!`);
	},
};