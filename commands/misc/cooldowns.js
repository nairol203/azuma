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
		const userId = interaction.member.user.id;
		const user = client.users.cache.get(userId);
		const { reset } = args;
		if (reset) {
			const owner = client.users.cache.get('255739211112513536')
			if (userId !== '255739211112513536') {
				owner.send(`<@${userId}> hat eine Anfrage zum Cooldown Reset gemacht: ` + reset);
				return [ 'Wir haben deine Anfrage erhalten! Missbrauch wird bestraft!' ];
			}
			else {
				cooldowns.resetCooldown(userId, reset);
				owner.send(`<@${userId}> hat einen Cooldown Reset gemacht: ` + reset);
				return [ 'Deine Cooldowns ('+ reset + ') wurden erfolgreich zurückgesetzt! Missbrauch wird bestraft!' ];
			}
		}
		const embed = new MessageEmbed()
			.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
			.addFields(
				{ name: `Cooldowns von ${user.username}`, value: `
Daily: **${await cooldowns.mathCooldown(userId, 'daily')}**
Work: **${await cooldowns.mathCooldown(userId, 'work')}**` },
				{ name: 'Reset cooldowns', value: 'Du glaubst deine Cooldowns sind verbuggt?\nBenutze `/cooldowns <reset>` um deine\nCooldowns zurückzusetzen!' },
			)
            .setFooter('Azuma | Contact @florian#0002 for help.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
			.setColor('#f77600');
		return embed;
	},
};