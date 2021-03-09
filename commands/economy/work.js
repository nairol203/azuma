const economy = require('../../features/economy');
const business = require('../../features/business');
const { MessageEmbed } = require('discord.js');

module.exports = {
	slash: true,
	cooldown: 8 * 60 * 60,
	description: 'Verkaufe die Ware von deinem Unternehmen!\nBenötigt ein Business (!business buy)',
	callback: async ({ interaction }) => {
		const guildId = interaction.guild_id;
		const userId = interaction.member.user.id;
		const getBusiness = await business.getBusiness(guildId, userId);
		if (getBusiness === null) return '<:no:767394810909949983> | Du hast kein Unternehmen, kaufe eins mit `!business buy`!';

		const company = await business.setCompany(guildId, userId);
		const profit = await business.checkProfit(guildId, userId);
		
		await economy.addCoins(guildId, userId, profit);
		const embed = new MessageEmbed()
			.setTitle('Verkauf erfolgreich')
			.setDescription(`Du hast die hergestellte Ware von deiner ${company.name} verkauft.`)
			.addField('Umsatz', `\`${profit}\` 💵`)
			.setFooter('Du kannst alle 8 Stunden deine Ware verkaufen.')
			.setColor('#2f3136');
		return embed;
	},
};