const { MessageEmbed } = require('discord.js');
const cooldowns = require('../../features/cooldowns');

module.exports = {
	aliases: 'cd',
	callback: async ({ message }) => {
		const { author, channel } = message;
		const userId = author.id;
		const embed = new MessageEmbed()
			.addFields(
				{ name: `Cooldowns von ${author.username}`, value: `
Daily: **${await cooldowns.mathCooldown(userId, 'daily')}**
Work: **${await cooldowns.mathCooldown(userId, 'work')}**` },
				{ name: 'Reset cooldowns', value: 'Wenn du deine Cooldowns zurücksetzen willst,\ngehe auf <http://bit.ly/reset-cooldowns>' },
			)
			.setColor('#f77600');
		channel.send(embed);
	},
};