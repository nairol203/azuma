const Discord = require('discord.js');
const economy = require('../../features/economy');
const cooldowns = require('../../features/cooldowns');

module.exports = {
	callback: async ({ message }) => {
		const { author, guild } = message;

		const getCd = await cooldowns.getCooldown(message.author.id, 'daily');
		if (!getCd) {
			await cooldowns.setCooldown(message.author.id, 'daily', 24 * 60 * 60);
		}
		else {
			message.reply(`du hast noch ${getCd.cooldown} Sekunden Cooldown!`);
			return;
		}

		const coinsToGive = 500;

		const newBalance = await economy.addCoins(guild.id, author.id, coinsToGive);

		const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.addField(`💵  |  **${message.author.username}**,`, `du hast deinen Daily geclaimed!\n\`+${coinsToGive} Credits\`\ndu hast insgesamt \`${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(newBalance)} Credits\`.`);
		message.channel.send(embed);
	},
};