const { MessageEmbed } = require('discord.js');
const cooldowns = require('../../cooldowns');

module.exports = {
	slash: true,
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
				owner.send(`<@${userId}> hat eine Anfrage zum Cooldown Reset gemacht!`);
				return 'Wir haben deine Anfrage erhalten! Missbrauch wird bestraft!';
			}
			else {
				cooldowns.resetCooldown(userId);
				owner.send(`<@${userId}> hat einen Cooldown Reset gemacht!`);
				return 'Deine Cooldowns wurden erfolgreich zurückgesetzt! Missbrauch wird bestraft!';
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