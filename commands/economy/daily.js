const { MessageEmbed } = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	slash: true,
	cooldown: 24 * 60 * 60,
	callback: async ({ interaction }) => {
		const guildId = interaction.guild_id;
		const user = interaction.member.user;
		const userId = user.id;
		const reward = 500;
		const newBalance = await economy.addCoins(guildId, userId, reward);
		const embed = new MessageEmbed()
			.setColor('#f77600')
			.addField(`💵  |  **${user.username}**,`, `du hast deinen Daily geclaimed!\n\`+${reward} Credits\`\ndu hast insgesamt \`${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(newBalance)} Credits\`.`);
		return embed;

		// const { author, guild } = message;

		// const coinsToGive = 500;

		// const newBalance = await economy.addCoins(guild.id, author.id, coinsToGive);

		// const embed = new Discord.MessageEmbed()
		// 	.setColor('#f77600')
		// 	.addField(`💵  |  **${message.author.username}**,`, `du hast deinen Daily geclaimed!\n\`+${coinsToGive} Credits\`\ndu hast insgesamt \`${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(newBalance)} Credits\`.`);
		// message.channel.send(embed);
	},
};