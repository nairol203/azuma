const Discord = require('discord.js');
const business = require('../../features/business');

module.exports = {
	aliases: 'cd',
	callback: async ({ message }) => {
		const { author, channel, guild } = message;
		const guildId = guild.id;
		const userId = author.id;
		async function getCooldown(type) {
			const cooldown = await business.getCooldown(type, guildId, userId);
			if (!cooldown) {
				return 'Ready!';
			}
			let seconds = cooldown.cooldown;
			const hours = Math.floor((seconds % (3600 * 24)) / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			seconds = Math.floor(seconds % 60);
			let result = '';
			if (hours) {
				result += hours + 'h ';
			}
			if (minutes) {
				result += minutes + 'm ';
			}
			if (seconds) {
				result += seconds + 's ';
			}
			return result;
		}
		const embed = new Discord.MessageEmbed()
			.addFields(
				{ name: `Cooldowns von ${author.username}`, value: `
Daily: **${await getCooldown('daily')}**
Work: **${await getCooldown('work')}**` },
				{ name: 'Reset cooldowns', value: 'Wenn du deine Cooldowns zurücksetzen willst,\ngehe auf <http://bit.ly/reset-cooldowns>' },
			)
			.setColor('#f77600');
		channel.send(embed);
	},
};