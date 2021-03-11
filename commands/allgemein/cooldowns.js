const { MessageEmbed } = require('discord.js');
const cooldowns = require('../../cooldowns');

module.exports = {
	slash: true,
	callback: async ({ interaction }) => {
		const user = interaction.member.user;
		const userId = user.id;
		const embed = new MessageEmbed()
			.addFields(
				{ name: `Cooldowns von ${user.username}`, value: `
Daily: **${await cooldowns.mathCooldown(userId, 'daily')}**
Work: **${await cooldowns.mathCooldown(userId, 'work')}**` },
				{ name: 'Reset cooldowns', value: 'Wenn du deine Cooldowns zurücksetzen willst,\ngehe auf <http://bit.ly/reset-cooldowns>' },
			)
			.setColor('#f77600');
		return embed;
	},
};