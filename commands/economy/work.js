const Discord = require('discord.js');

const economy = require('../../features/economy');
const business = require('../../features/business');

module.exports = {
	cooldown: 8 * 60 * 60,
	callback: async ({ message }) => {
		const { author, guild, channel } = message;
		const guildId = guild.id;
		const userId = author.id;
		const getBusiness = await business.getBusiness(guildId, userId);
		if (getBusiness === null) return channel.send('<:no:767394810909949983> | Du hast kein Unternehmen, kaufe eins mit `!business buy`!');

		const company = await business.setCompany(guildId, userId);
		const profit = await business.checkProfit(guildId, userId);
		const d = Math.random();
		if (d > 0.05) {
			await economy.addCoins(guildId, userId, profit);
			const embed = new Discord.MessageEmbed()
				.setTitle('Verkauf erfolgreich')
				.setDescription(`Du hast die hergestellte Ware von deiner ${company.name} verkauft.`)
				.addField('Umsatz', `\`${profit}\` 💵`)
				.setFooter('Du kannst alle 8 Stunden deine Ware verkaufen.')
				.setColor('#2f3136');
			channel.send(embed);
		}
		else if (d < 0.05 & d > 0.01) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Verkauf gescheitert')
				.setDescription('Du warst beim Verkauf deiner Waren unaufmerksam und hast dich von den Cops erwischen lassen.')
				.addField('Umsatz', '`0` 💵')
				.setFooter('Du kannst alle 8 Stunden deine Ware verkaufen.')
				.setColor('#2f3136');
			channel.send(embed);
		}
		else if (d < 0.01) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Verkauf gescheitert')
				.setDescription('Du hast leider eine toxic RL-Lobby erwischt und wurdest von einem Noobbike weggesprengt')
				.addField('Umsatz', '`-10.000` 💵')
				.setFooter('Du kannst alle 8 Stunden deine Ware verkaufen.')
				.setColor('#2f3136');
			channel.send(embed);
		}
	},
};