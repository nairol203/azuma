const Discord = require('discord.js');

const economy = require('../../features/economy');
const business = require('../../features/business');

module.exports = {
	cooldown: '8h',
	callback: async ({ message }) => {
		const { author, guild, channel } = message;
		const guildId = guild.id;
		const userId = author.id;

		const company = await business.setCompany(guildId, userId);
		const profit = await business.checkProfit(guildId, userId);
		const getBusiness = await business.getBusiness(guildId, userId);

		if (getBusiness === null) return channel.send('<:no:767394810909949983> | Du hast kein Unternehmen, kaufe eins mit `!business buy`!');

		await economy.addCoins(guildId, userId, profit);

		const embed = new Discord.MessageEmbed()
			.setTitle('Ware verkaufen')
			.setDescription(`Du hast die hergestellte Ware von deiner ${company.name} verkauft.`)
			.addField('Umsatz', `\`${profit}\` 💵`)
			.setFooter('Du kannst alle 8 Stunden deine Ware verkaufen.')
			.setColor('#2c2f33');
		channel.send(embed);
	},
};