const { MessageEmbed } = require('discord.js');
const cooldowns = require('../../cooldowns');

module.exports = {
	description: 'Zeigt alle Cooldowns an',
	options: [
		{
			name: 'reset',
			description: 'Setze deine Cooldowns bei einem Bug zurück. Missbrauch wird bestraft!',
			type: 3,
			choices: [
				{
					name: 'daily',
					value: 'daily',
				},
				{
					name: 'work',
					value: 'work',
				},
				{
					name: 'all',
					value: 'all',
				},
			],
		},
	],
	callback: async ({ client, interaction, args }) => {
		// const user = interaction.member.user;
		const userId = interaction.member.user.id;
		const user = client.users.cache.get(userId);
		const { reset } = args;
		if (reset) {
			const channel = client.channels.cache.get(interaction.channel_id);
			const authorPerms = channel.permissionsFor(user);
			const owner = client.users.cache.get('255739211112513536')
			if (!authorPerms || !authorPerms.has('ADMINISTRATOR')) {
				owner.send(`<@${userId}> hat eine Anfrage zum Cooldown Reset gemacht: ` + reset);
				return 'Wir haben deine Anfrage erhalten! Missbrauch wird bestraft!';
			}
			else {
				cooldowns.resetCooldown(userId, reset);
				owner.send(`<@${userId}> hat einen Cooldown Reset gemacht: ` + reset);
				return 'Deine Cooldowns ('+ reset + ') wurden erfolgreich zurückgesetzt! Missbrauch wird bestraft!';
			}
		}
		const embed = new MessageEmbed()
			.addFields(
				{ name: `Cooldowns von ${user.username}`, value: `
Daily: **${await cooldowns.mathCooldown(userId, 'daily')}**
Work: **${await cooldowns.mathCooldown(userId, 'work')}**` },
				{ name: 'Reset cooldowns', value: 'Du glaubst deine Cooldowns sind verbuggt?\nBenutze `/cooldowns <reset>` um deine\nCooldowns zurückzusetzen!' },
			)
			.setColor('#f77600');
		return embed;
	},
};