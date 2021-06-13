const { MessageEmbed } = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	cooldown: 24 * 60 * 60,
	description: 'Claime alle 24 Stunden 500 Credits!',
	callback: async ({ client, interaction }) => {
		const guildId = interaction.guildID;
		const user = interaction.member.user;
		const reward = 500;
		const newBalance = await economy.addCoins(guildId, user.id, reward);
		const embed = new MessageEmbed()
			.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`)
			.setDescription('Du hast deine täglichen Credits erhalten!')
			.addFields(
				{ name: 'Reward', value: reward + ' Credits', inline: true },
				{ name: 'Deine Credits', value: newBalance + ' Credits', inline: true },
			)
            .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
			.setColor('#f77600');
		interaction.reply({ embeds: [embed] });
	},
};