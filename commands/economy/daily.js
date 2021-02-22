const Discord = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	cooldown: '24h',
	callback: async ({ message }) => {
		const { author, guild } = message;

		const coinsToGive = 500;

		const newBalance = await economy.addCoins(guild.id, author.id, coinsToGive);

		const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.addField(`💵  |  **${message.author.username}**,`, `du hast deinen Daily geclaimed!\n\`+${coinsToGive} Credits\`\ndu hast insgesamt \`${newBalance} Credits\`.`);
		message.channel.send(embed);
	},
};