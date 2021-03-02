const { MessageEmbed } = require('discord.js');
const muteSchema = require('../../models/mute-schema');

module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<userId>',
	callback: async ({ message, args }) => {
		const { guild } = message;

		const id = args[0];

		const members = await guild.members.fetch();
		const target = members.get(id);
		const isInDiscord = !!target;

		const currentMute = await muteSchema.findOne({
			userId: id,
			guildId: guild.id,
			current: true,
		});

		const embed = new MessageEmbed()
			.setAuthor(
				`Mute info von ${target ? target.user.tag : id}`,
				target ? target.user.displayAvatarURL() : '',
			)
			.addField('Aktuell muted', currentMute ? 'Ja' : 'Nein')
			.addField('Ist auf diesem Server', isInDiscord ? 'Ja' : 'Nein');

		if (currentMute) {
			const date = new Date(currentMute.expires);

			embed
				.addField('Gemuted von', `<@${currentMute.staffId}>`)
				.addField('Gemuted für', currentMute.reason.toLowerCase())
				.addField('Mute läuft aus in', `${date.toLocaleString()} EST`);
		}

		message.reply(embed);
	},
};