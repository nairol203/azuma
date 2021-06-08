const { MessageEmbed } = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	cooldown: 24 * 60 * 60,
	description: 'Claime alle 24 Stunden 500 Credits!',
	callback: async ({ client, interaction }) => {
		const guildId = interaction.guild_id;
		const user = interaction.member.user;
		const userId = user.id;
		const reward = 500;
		const newBalance = await economy.addCoins(guildId, userId, reward);
		const embed = new MessageEmbed()
			.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
			.setColor('#f77600')
			.addField(`💵  |  **${user.username}**,`, `du hast deinen Daily geclaimed!\n\`+${reward} Credits\`\ndu hast insgesamt \`${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(newBalance)} Credits\`.`)
            .setFooter('Azuma | Contact @florian#0002 for help.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);;
		return embed;
	},
};